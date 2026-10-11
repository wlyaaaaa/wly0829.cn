import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/typeset/typeset_apply.js',import.meta.url),'utf8');
const fill=source.slice(source.indexOf('  function fillShortColumns()'),source.indexOf('  function fitIllustrationRows()'));
const stack=source.slice(source.indexOf('  function stackMediaRows()'),source.indexOf('  receipt.balance=[];'));
function fixture(shortHeight,tallHeight,{valign='',mid=false,media=false}={}) {
  const row={style:{},dataset:{rowValign:valign},children:[],appended:[],
    matches:s=>s==='.fit-ill'?media:s==='.mid'?mid:false,closest:()=>null,
    querySelector:s=>media && s.includes('illustration')?row.children[1].children[0]:null,
    getBoundingClientRect:()=>({top:0,bottom:tallHeight,width:1400,height:tallHeight}),
    append(...items){this.appended.push(...items);}};
  for (const [i,h] of [tallHeight,shortHeight].entries()) {
    const col={style:{},children:[],media:media && i===1,
      matches:s=>s==='.col',classList:{remove(){}},querySelectorAll:()=>[],closest:()=>null,
      getBoundingClientRect(){const top=this.style.alignSelf==='center'?(tallHeight-h)/2:0;return {top,bottom:top+h,left:i*840,right:i*840+(i?560:840),width:i?560:840,height:h};},
      querySelector:s=>col.media && s.includes('illustration')?col.children[0]:null};
    const block={style:{},nodeValue:'文字',closest:()=>null,dataset:{comp:col.media?'illustration':'prose'},parentElement:col,
      matches:s=>s.includes(`[data-comp="${block.dataset.comp}"]`),querySelectorAll:()=>col.media?[img]:[],
      querySelector:s=>s==='img' && col.media?img:null,
      getBoundingClientRect(){return {...col.getBoundingClientRect(),height:h};}};
    const img={style:{},naturalWidth:4,naturalHeight:3,getBoundingClientRect:()=>({width:560,height:420})};
    col.children.push(block);row.children.push(col);
  }
  const document={body:{classList:{contains:c=>c==='o-h'}},createTreeWalker:e=>{let i=0;return {nextNode:()=>e.children[i++]||null};},createRange:()=>({selectNodeContents(n){this.node=n;},getClientRects(){return [this.node.getBoundingClientRect()];}}),createElement:()=>({style:{},append(...items){for(const item of items)item.parentElement=this;}})};
  const scope={root:{querySelectorAll:()=>[row]},receipt:{balance:[]},document,NodeFilter:{SHOW_TEXT:4},
    getComputedStyle:el=>({display:el.style.display||'block',position:'relative',rowGap:'12px'}),
    columnParts:c=>c.children,mediaColumn:c=>c.media};
  vm.runInNewContext(fill+stack+'fillShortColumns();stackMediaRows();stackTextRows();',scope);
  return row;
}
test('measured short text columns share remaining vertical space without stretching cards',()=>{
  for(const gap of [219,277]) {
    const row=fixture(400,400+gap),short=row.children[1],box=short.getBoundingClientRect();
    assert.equal(short.style.alignSelf,'center');assert.equal(box.top,gap/2);
    assert.equal(row.getBoundingClientRect().bottom-box.bottom,gap/2);
    assert.equal(box.height,400);assert.equal(short.children[0].style.height,undefined);
  }
});
test('explicit start and existing centered author rows survive runtime balancing',()=>{
  const start=fixture(400,677,{valign:'start'}),center=fixture(400,677,{mid:true});
  assert.equal(start.children[1].getBoundingClientRect().top,0);
  assert.equal(start.children[1].style.alignSelf,'start');
  assert.equal(center.children[1].style.alignSelf,'center');
});
test('a 4:3 illustration beside a tall title/text column remains in its horizontal row',()=>{
  const row=fixture(420,800,{media:true}),col=row.children[1],ill=col.children[0];
  assert.equal(ill.parentElement,col);assert.equal(row.appended.length,0);
  assert.notEqual(row.dataset.typesetFit,'stacked');assert.notEqual(row.style.flexDirection,'column');
  assert.ok(col.getBoundingClientRect().left>row.children[0].getBoundingClientRect().left);
  assert.equal(ill.querySelector('img').getBoundingClientRect().height,420);
});
test('an uneven horizontal text row stacks while balanced and illustration rows keep their layout',()=>{
  const row=fixture(200,800);assert.equal(row.style.flexDirection,'column');
  assert.equal(row.dataset.typesetFit,'stacked-text');assert.equal(row.appended.length,0);
  for(const col of row.children){assert.equal(col.style.width,'100%');assert.equal(col.style.alignSelf,'start');assert.equal(col.style.justifyContent,'flex-start');}
  for(const sample of [fixture(400,619),fixture(420,800,{media:true})])assert.notEqual(sample.style.flexDirection,'column');
});
test('ordinary feature groups measure card contents despite equal frames and preserve protected layouts',()=>{
  for(const [height,protectedGrid,changed] of [[200,false,true],[600,false,false],[200,true,false]]) {
    const grid=fixture(height,800);grid.matches=s=>protectedGrid && s.includes('feature-masonry-grid');
    for(const card of grid.children){card.style.alignSelf='start';const body=card.children[0].getBoundingClientRect(),box=card.getBoundingClientRect();card.matches=s=>s.includes('.feature-item');card.querySelectorAll=()=>card.children;card.getBoundingClientRect=()=>({...box,top:0,bottom:800,height:800});card.children[0].getBoundingClientRect=()=>({...body,top:0,bottom:body.height});}
    const scope={root:{querySelectorAll:()=>[grid]},receipt:{balance:[]},NodeFilter:{SHOW_TEXT:4},document:{body:{classList:{contains:()=>true}},createTreeWalker:e=>{let i=0;return {nextNode:()=>e.children[i++]||null};},createRange:()=>({selectNodeContents(n){this.node=n;},getClientRects(){return [this.node.getBoundingClientRect()];}})},getComputedStyle:e=>({display:e===grid?'grid':'block',position:'relative'})};
    vm.runInNewContext(stack+'stackFeatureGroups();',scope);
    assert.equal(grid.dataset.typesetFit==='stacked-features',changed);
    if(changed){assert.equal(grid.style.gridTemplateColumns,'minmax(0,1fr)');for(const card of grid.children){assert.equal(card.style.gridColumn,'1 / -1');assert.equal(card.style.gridRow,'auto');}}
  }
});
test('an overflowing commit hash gains break points without changing any character',()=>{const hash='abcdef01'.repeat(8),script=source.slice(source.indexOf('        const parts='),source.indexOf('        parts.forEach')),scope={match:[hash],inPath:false,available:100,canvas:{measureText:()=>({width:640})}};vm.runInNewContext(script+'globalThis.result=parts;',scope);assert.equal(scope.result.join(''),hash);assert.ok(scope.result.every(part=>part.length<=8));});

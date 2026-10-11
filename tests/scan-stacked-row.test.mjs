import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../site-astro/tools/scan_glance_dom.js',import.meta.url),'utf8');
const block=source.slice(source.indexOf("  for (const row of body.querySelectorAll('.row'))"),source.indexOf('  const dateSeen'));
function measure(display,flexDirection) {
  const col={getBoundingClientRect:()=>({left:0,right:400,width:400,top:0,bottom:800}),contains:()=>true};
  const row={children:[col],getBoundingClientRect:()=>({left:0,right:400,width:400,top:0,bottom:800,height:800}),closest:()=>null,contains:()=>true};
  const blank=[];
  vm.runInNewContext(block,{body:{querySelectorAll:()=>[row]},visible:()=>true,css:()=>({display,flexDirection}),state:()=>({skip:false,why:[]}),painted:[{e:{},rs:[{left:0,right:400,top:0,bottom:500}]}],t:{row_blank_px:200,row_blank_fraction:.2},blank,sel:()=>'.row',pack:(e,text,message,extra)=>({message,...extra})});
  return blank;
}
test('实际横向短栏仍报告300px，堆叠行不把后续块当空白',()=>{
  assert.equal(measure('grid','row')[0].gapHeight,300);
  assert.equal(measure('flex','row')[0].gapHeight,300);
  assert.deepEqual(measure('flex','column'),[]);
});

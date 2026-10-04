import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const script=fs.readFileSync(new URL('../scripts/typeset-qa.js',import.meta.url),'utf8');
const helper=script.slice(script.indexOf('/* typeset-content-acceptance-v1 */'),script.indexOf('/* end-typeset-content-acceptance-v1 */'));
const sandbox={};vm.runInNewContext(helper,sandbox);
const rect=(left,top,width,height)=>({left,top,width,height});

test('fully occupied actual content has no blank candidate',()=>{
 const proof=sandbox.contentBlankRegions([rect(20,40,900,800)],{width:1000,height:1000});
 assert.equal(proof.components.length,0);assert.equal(proof.empty_area_px2,0);
});

test('the left-column blank is found even with a populated right column',()=>{
 const proof=sandbox.contentBlankRegions([rect(0,0,1200,100),rect(0,100,700,300),rect(720,100,480,1000)],{width:1440,height:1000});
 assert.ok(proof.components.some(region=>region.viewport_fraction>.15));
 assert.ok(proof.largest_empty_rectangle.viewport_fraction>.15);
 assert.ok(proof.largest_empty_rectangle.bounds.width<1200);
});

test('15 percent is exact and is not replaced by a width or strip threshold',()=>{
 const occupied=height=>[rect(0,0,1000,100),rect(0,100,100,900),rect(700,100,300,900),rect(100,100+height,600,900-height)];
 const equal=sandbox.contentBlankRegions(occupied(360),{width:1440,height:1000});
 assert.equal(equal.components.length,0);assert.equal(equal.largest_empty_rectangle.viewport_fraction,.15);
 assert.equal(equal.definite_fail,false);
 const over=sandbox.contentBlankRegions(occupied(360.001),{width:1440,height:1000});
 assert.equal(over.components.length,1);assert.ok(over.largest_empty_rectangle.viewport_fraction>.15);
 assert.equal(over.definite_fail,true);
});

test('an L-shaped continuous blank keeps its area even when its largest rectangle is smaller',()=>{
 const proof=sandbox.contentBlankRegions([rect(0,0,800,100),rect(0,100,100,600),rect(700,100,100,600),rect(0,700,800,100),rect(300,100,400,400)],{width:1000,height:1000});
 assert.equal(proof.components.length,1);assert.equal(proof.components[0].area_px2,200000);
 assert.equal(proof.largest_empty_rectangle.area_px2,120000);
 assert.equal(proof.definite_fail,false);assert.equal(proof.components[0].status,'candidate_requires_visual_review');
});

test('navigation and outer margins do not enter the content region',()=>{
 const proof=sandbox.contentBlankRegions([rect(80,200,300,100),rect(80,300,300,100)],{width:1000,height:1000});
 assert.deepEqual(JSON.parse(JSON.stringify(proof.content_region)),{left:80,top:200,width:300,height:200});
 assert.equal(proof.components.length,0);
});

test('a missing content measurement cannot become a pass from an empty container',()=>{
 const proof=sandbox.contentBlankRegions([],{width:1000,height:1000});
 assert.equal(proof.content_region,null);assert.ok(proof.issues.length);
});

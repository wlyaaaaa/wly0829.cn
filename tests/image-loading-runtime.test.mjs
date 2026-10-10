import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../scripts/image-loading-runtime.js',import.meta.url),'utf8');
const activate=new Function('document','innerHeight','innerWidth','location',`return (${source.match(/ function activateImages[\s\S]*?\n document.addEventListener/)[0].replace(/\n document.addEventListener$/,'')})()`);
test('native lazy receives real URLs, with visible and initial hash images eager',()=>{
 for(const [top,requested] of [[50,false],[2500,true],[2500,false]]){const s={dataset:{srcset:'/title.avif'}},im={dataset:{tsSrc:'/title.png',srcset:'/title@2.png 2x'},closest:q=>q==='picture'?{querySelectorAll:()=>[s]}:null,hasAttribute:()=>false,getBoundingClientRect:()=>({top,bottom:top+100,left:0,right:100,width:100,height:100})};activate({getElementById:()=>({closest:()=>null,contains:()=>requested}),querySelectorAll:q=>q==='img'?[im]:[]},1080,1920,{hash:'#focus'});assert.equal(im.src,'/title.png');assert.equal(im.loading,top<1080||requested?'eager':'lazy');assert.equal(im.srcset,'/title@2.png 2x');assert.equal(s.srcset,'/title.avif');assert.deepEqual(im.dataset,{});}
});
const helper=readFileSync(new URL('../site-astro/src/image-loading.ts',import.meta.url),'utf8');
const replaceLoader=new Function('imageLoading',helper.slice(helper.indexOf('export function')).replace('export function','return function').replace('html: string','html'))(source);
test('replacing embedded loader preserves error capture and unrelated scripts',()=>{
 const result=replaceLoader('<script data-resource-retry-capture>keepCapture();\n(() => {\n \'use strict\';\n legacyLoader();})();</script><script>otherScript();</script>');
 assert.ok(result.includes('keepCapture();'));assert.ok(result.includes('activateImages'));assert.ok(result.includes('<script>otherScript();</script>'));assert.ok(!result.includes('legacyLoader'));
});
test('pages without embedded error capture receive the native loader',()=>{
 assert.ok(replaceLoader('<div>page</div>').startsWith('<div>page</div><script data-native-image-loading>'));
});

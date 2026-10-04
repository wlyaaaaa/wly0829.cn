import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../scripts/typeset-layout.js',import.meta.url),'utf8');
const helper=source.slice(source.indexOf('/* typeset-live-flow-v1 */'),source.indexOf('/* end-typeset-live-flow-v1 */'));
const sandbox={window:{addEventListener(){}},document:{addEventListener(){}},requestAnimationFrame(){return 1}};
vm.runInNewContext(helper,sandbox);
const {plan}=sandbox.window.TypesetLiveFlow;

test('nearby live rows form one natural-flow band in source order',()=>{
 const rows=plan([{rect:[.6,.5,.3,.025]},{rect:[.1,.5,.3,.025]},{rect:[.1,.54,.8,.025]}],1000);
 assert.equal(rows.length,1);
 assert.deepEqual(rows[0].cells.map(cell=>cell.rect[0]).join(','),'0.1,0.6,0.1');
 assert.ok(rows[0].start<.5&&rows[0].end>.565);
});

test('separate live regions retain the source content between them',()=>{
 const rows=plan([{rect:[.1,.2,.8,.03]},{rect:[.1,.7,.8,.03]}],1000);
 assert.equal(rows.length,2);
 assert.ok(rows[0].end<rows[1].start);
});

test('large desktop and mobile blank frames are replaced in place without a preceding empty panel',()=>{
 const desktop=plan([{rect:[.2709,.2735,.7081,.5861]}],800)[0];
 const mobile=plan([{rect:[.0298,.6245,.9405,.3448]}],1500)[0];
 assert.equal(desktop.replace,true);
 assert.equal(mobile.replace,true);
 assert.equal(plan([{rect:[.2,.8,.65,.02]}],1500)[0].replace,false);
});

test('lamp regions remain in their raster position and are never card bands',()=>{
 assert.equal(plan([{rect:[.1,.2,.1,.02],livePart:'lamp'}],1000).length,0);
 assert.equal(plan([{rect:[.1,.2,.1,.02],live_part:'lamp'},{rect:[.1,.4,.8,.04]}],1000).length,1);
});

test('a supplied mask changes only the removed source region, and static buttons stay intact',()=>{
 const row=plan([{rect:[.1,.5,.8,.03],maskRect:[.08,.49,.84,.05]}],1000,[[.85,.48,.1,.09]])[0];
 assert.equal(row.cells[0].maskRect.join(','),'0.08,0.49,0.84,0.05');
 assert.ok(row.start<=.48&&row.end>=.57);
});

test('footer buttons remain after the live region instead of being pulled into its header',()=>{
 const row=plan([{rect:[.1,.8,.8,.03]}],1000,[[.1,.84,.8,.04]])[0];
 assert.ok(row.end<=.84);
});

test('invalid source geometry does not create an accidental full-page replacement',()=>{
 assert.equal(plan([{rect:[.1,.2,0,.02]},{rect:[0,0,2,2]},{rect:[0,NaN,1,.1]}],1000).length,0);
 const row=plan([{rect:[.1,.5,.8,.03]}],1000,[[0,0,1,1]])[0];
 assert.ok(row.start>.4&&row.end<.6);
});

test('compact plain frames cut only their own pixels and retain source labels between rows',()=>{
 const rows=plan([{rect:[.1,.3,.2,.04],compactFrame:true},{rect:[.1,.4,.2,.04],compactFrame:true}],1000);
 assert.equal(rows.length,2);
 assert.equal(rows[0].start,.3);
 assert.ok(Math.abs(rows[0].end-.34)<1e-10);
 assert.equal(rows[1].start,.4);
 assert.ok(Math.abs(rows[1].end-.44)<1e-10);
});

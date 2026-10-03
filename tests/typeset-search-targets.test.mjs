import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { generateTypesetSearchOverlay } from '../scripts/typeset-search-overlay.mjs';

test('partial overlays retain useful published search text while retiring missing pages and fragments', async()=>{
  const task=await mkdtemp(path.join(os.tmpdir(),'search-target-fixture-'));
  const baseline=path.join(task,'baseline'),output=path.join(task,'output');
  const put=async(rel,text)=>{const p=path.join(baseline,rel);await mkdir(path.dirname(p),{recursive:true});await writeFile(p,text);};
  await put('index.html','<h1 id="actual">现有首页</h1>');
  await put('existing/index.html','<h2 id="deep">有用的完整说明</h2>');
  await put('cockpit/index.html','<section id="current-screen">当前屏</section>');
  const retained={title:'保留现有说明',detail:'保留完整有用说明',href:'/existing/#deep',scopes:['system'],aliases:['普通词'],search:'原来的说明'};
  const stale=[{title:'删掉的旧首页节点',href:'/#deleted'},{title:'未上线页面',href:'/docs/missing/'}];
  const serialize=(e,p=false)=>'window.'+(p?'__WLY_PROJECT_SEARCH_INDEX__':'__WLY_SEARCH_INDEX__')+'='+JSON.stringify(e)+';';
  await put('search-index.js',serialize([retained,...stale]));await put('search-projects.js',serialize([],true));
  const source=path.join(task,'source.json'),sourceText=JSON.stringify({page:'cockpit',url:'/cockpit/',title:'驾驶舱',screens:[{id:'current-screen',title:'真实状态',text:'同版定稿原文。先读 E:\\Fixture\\steps.md。继续说明。'}]});
  await writeFile(source,sourceText);
  const config=path.join(task,'config.json');await writeFile(config,JSON.stringify({baseline,output,pages:[{source,page:'cockpit',project:false,sha256:createHash('sha256').update(sourceText).digest('hex')}]}));
  const renderer={compactSearchProjection:e=>e,serializeSearchAsset:serialize};
  const report=await generateTypesetSearchOverlay(renderer,config);
  const result=await readFile(path.join(output,'search-index.js'),'utf8');
  const entries=JSON.parse(result.slice(result.indexOf('=')+1,-1));
  assert.deepEqual(entries.find(e=>e.href==='/existing/#deep'),retained);
  assert.equal(report.unpublished_records_removed.length,2);
  assert.ok(entries.some(e=>e.href==='/cockpit/#current-screen'&&e.detail==='同版定稿原文。先读 （本机路径）。继续说明。'));
  assert.ok(!result.includes('Fixture'));
  assert.ok(!entries.some(e=>e.href==='/#deleted'||e.href==='/docs/missing/'));
  const recycler='E:/.agents/tools/Move-TaskItemToRecycleBin.ps1';
  if(process.platform==='win32'&&existsSync(recycler)){
    const receipt=JSON.parse(execFileSync('pwsh',['-NoProfile','-File',recycler,'-LiteralPath',task,'-AllowedRoot',os.tmpdir(),'-Json'],{encoding:'utf8',windowsHide:true}));
    assert.equal(existsSync(task),false,JSON.stringify(receipt));
  }
});

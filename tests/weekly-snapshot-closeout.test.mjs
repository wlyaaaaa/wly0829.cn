import test from 'node:test';
import assert from 'node:assert/strict';
import {project as documents, modules as documentModules} from '../app/content-document-materials.js';
import {project as memory, modules as memoryModules, codexMemorySnapshot} from '../app/content-codex-memory.js';
import {skills} from '../app/content-skills.js';
import {skillOutcomes} from '../app/content-skill-guides.js';
test('screen and print material design remains separate from historical render artifacts',()=>{
 const text=JSON.stringify({documents,documentModules});
 assert.match(text,/非打印PDF.*彩色/s); assert.match(text,/打印版才另验灰度|打印版本另验/);
 assert.match(text,/不强制两版|不要求每次.*两版/);assert.match(text,/原件.*历史不改|原件和已签署.*不重着色/);
 assert.match(text,/灰度辅助制品/);assert.match(text,/本轮没有改渲染器或重做样张/);
});
test('Antigravity CLI selected recovery does not restart a model or promise login history',()=>{
 const text=JSON.stringify(memoryModules.find(m=>m.slug==='gemini-workspace-memory'));
 for(const token of ['antigravity-cli/settings.json','annotations','brain','OAuth','jsonl','不调用退役Gemini模型命令'])assert.ok(text.includes(token),token);
 assert.match(text,/旧.*|9月9日/);assert.match(text,/不能.*新增CLI/);
 assert.equal(codexMemorySnapshot.currentPointId,'20260924T041509Z-89eabfd3');
 assert.equal(codexMemorySnapshot.conversationFileCount,1983);
 assert.match(memory.currentSnapshot.boundary,/不等于本轮重新逐对象哈希.*实际恢复/);
});
test('vault Skill matches actual final readback and no-write stub boundaries',()=>{
 const skill=skills.find(x=>x.slug==='vault-workflow');const text=JSON.stringify({skill,outcome:skillOutcomes['vault-workflow']});
 assert.doesNotMatch(text,/README保护只有|README保护仍只有|后续字节回读另列未实现/);
 assert.match(text,/真实更新后回读分支/);assert.match(text,/已存在安全占位只证明占位.*不冒充新密文上传或密码验证/);assert.match(text,/效果未知不重放/);
});

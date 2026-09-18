import assert from "node:assert/strict";
import test from "node:test";
import {pcconfigModules,pcconfigProject} from "../app/content-pcconfig.js";
import {systemDependencyNodes} from "../app/system-home-content.js";
const recovery=pcconfigModules.find(x=>x.slug==="recovery-backup");
const reader=JSON.stringify({value:recovery.value,result:recovery.result,decisions:recovery.decisionImpact,states:recovery.readerStates});
const technical=JSON.stringify({implementation:recovery.implementation,boundaries:recovery.boundaries,failures:recovery.failures,sources:recovery.sources,verification:recovery.verification});
test("ordinary G/H files and protected recovery remain separate after source delivery",()=>{
 assert.match(reader,/普通资料和媒体.*原生 G\/H 副本/);
 assert.match(reader,/正式入口/);
 assert.match(reader,/普通同名更新不提供上一版历史/);
 assert.match(technical,/Password Center\/SecretBroker/);
 assert.match(technical,/Invoke-PasswordCenterColdBackup.ps1/);
 assert.doesNotMatch(JSON.stringify(recovery),/Password Center 与媒体\/PersonalData 走各自 P0|SecretRef、Password Center、媒体与其他受保护数据各走/);
});
test("sixteen current Cold groups preserve verified-copy and scoped prune boundaries",()=>{
 for(const term of ["16","DevConfig","微信","Documents","Downloads","TimeAudit","Codex","Docker","PersonalData","PersonalMedia","RecoveryKit","LocalToolbox","Ollama","Steam","_SavedGames","_AlternateRoots","CORE_RECOVERY","SHA-256","NTFS","hardlink","绝不跨 G/H 链接","不使用 /MIR","源变化"])
  assert.ok(technical.includes(term),"Cold source contract missing "+term);
 assert.match(technical,/复制.*核验.*(?:删除|清理)/s);
 assert.match(technical,/来源变化.*(?:零删除|保留)|源变化.*保留/s);
 assert.match(technical,/不是对所有普通文件逐个做 SHA-256/);
 assert.match(technical,/53.*(?:修复|内容)|修复.*53/s);
});
test("source delivery, historical first H and physical machine restore are independent",()=>{
 const all=JSON.stringify(pcconfigProject);
 assert.match(all,/2026-09-18T07:57:11Z.*16组H冷备.*8640.*8531705353/s);
 assert.match(all,/145307.*45218959121.*53/s);
 assert.match(technical,/2026-09-05.*首次/);
 assert.match(JSON.stringify(pcconfigProject.currentState.gaps),/16组H冷备.*不等于整机新装恢复.*物理离线/s);
 assert.match(recovery.status,/新机|整机/);
 assert.match(technical,/Media\/Packages 排除/);
 assert.doesNotMatch(recovery.status,/H 尚未返回|首次 H.*尚未验收/);
});
test("System recovery projects the same tested scope without claiming offline or machine recovery",()=>{
 const n=systemDependencyNodes.find(x=>x.id==="recovery-backup");
 for(const t of ["G/H","正式恢复入口","16组冷备","隔离还原","微信G/H全树","后来新增内容","下一次备份","应用真正看见数据"])assert.ok(n.detail.includes(t),t);
 assert.match(n.detail,/连接.*不称物理离线/);
 assert.match(n.detail,/备份通过不等于整机恢复/);
});

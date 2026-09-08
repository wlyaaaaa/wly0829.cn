import assert from "node:assert/strict";
import test from "node:test";
import { pcconfigModules, pcconfigProject } from "../app/content-pcconfig.js";
import { systemDependencyNodes } from "../app/system-home-content.js";

const recovery = pcconfigModules.find(({ slug }) => slug === "recovery-backup");
const reader = JSON.stringify({
  value: recovery.value,
  result: recovery.result,
  decisions: recovery.decisionImpact,
  states: recovery.readerStates
});
const technical = JSON.stringify({
  implementation: recovery.implementation,
  boundaries: recovery.boundaries,
  failures: recovery.failures,
  sources: recovery.sources,
  verification: recovery.verification
});

test("ordinary G backup bytes are not conflated with protected recovery carriers", () => {
  for (const term of ["普通资料和媒体", "原生 G/H 副本", "不要求先加密成 Carrier", "Password Center/SecretBroker", "正式入口"]) {
    assert.ok(reader.includes(term), `recovery reader omits ${term}`);
  }
  assert.doesNotMatch(JSON.stringify(recovery), /Password Center 与媒体\/PersonalData 走各自 P0|Password Center、媒体和其他受保护数据走 P0|SecretRef、Password Center、媒体与其他受保护数据各走/);
  assert.ok(pcconfigProject.usageExamples.some(({ moduleSlug, ask, effect }) =>
    moduleSlug === "recovery-backup" && ask.includes("资料和照片") && /普通.*原生格式.*凭据.*正式入口/.test(effect)
  ));
});

test("the expanded Cold plan preserves native scope and exact copy boundaries", () => {
  for (const term of [
    "14 组", "DevConfig", "微信", "软件环境", "AI 课程", "Documents", "Downloads", "TimeAudit",
    "Codex 记忆", "其他 AI 记忆", "Codex 对话", "Docker 自定义镜像", "PersonalData", "PersonalMedia", "RecoveryKit",
    "_SavedGames", "_AlternateRoots", "_PersonalRoots", "_quarantine/_staging", "CORE_RECOVERY",
    "36 小时", "五映射", "48 小时", "NTFS", "hardlink", "独立首副本", "绝不跨 G/H 链接",
    "100 GiB", "不使用 /MIR", "devconfig/timeaudit", "SHA-256", "源变化", "外部硬链接",
    "Invoke-PasswordCenterColdBackup.ps1"
  ]) assert.ok(technical.includes(term), `Cold reference omits ${term}`);
  assert.match(reader, /不去读 E 上的活动个人库|不读取 E 的活动个人库/);
  assert.ok(reader.includes("同名更新不提供上一版文件的版本历史"));
  assert.doesNotMatch(reader, /保留增量历史/);
  assert.match(technical, /正式替换 H 目标前检测到来源变化/);
  assert.match(technical, /不是发布后再核验/);
  assert.match(technical, /不是对所有普通文件逐个做 SHA-256/);
});

test("accepted first H backup, current completed Cold and unverified machine restore remain distinct", () => {
  assert.match(recovery.status, /11 个任务、14 组 G 来源、9 个必需集合/);
  assert.match(recovery.status, /9 月 5 日 H 首次备份已验收.*06:54 UTC冷备也已完成/);
  assert.match(recovery.status, /新机恢复.*仍未验收/);
  assert.match(technical, /本轮只读复核对应源码与测试范围/);
  assert.match(technical, /整体\/镜像 complete.*五映射 post_verified=true/s);
  assert.match(technical, /Media\/Packages 排除/);
  assert.match(reader, /专用手机包、云候选和精选分类保持原分工/);
  assert.match(JSON.stringify(pcconfigProject.currentState.gaps), /H 在 2026-09-05 已完成回盘与首次冷备验收.*H已可读.*Cold回执complete.*不保证之后G的增量已进入H.*新机恢复.*仍未验收/s);
  assert.doesNotMatch(recovery.status, /H 尚未返回|首次 H.*尚未验收/);
  assert.doesNotMatch(recovery.status, /9 个备份集合|10 个任务/);
});

test("the System recovery explanation keeps the same ordinary/protected distinction", () => {
  const node = systemDependencyNodes.find(({ id }) => id === "recovery-backup");
  assert.match(node.detail, /普通资料与媒体.*原生 G\/H 副本/);
  assert.match(node.detail, /只有真正凭据和受保护载荷/);
  assert.match(node.detail, /14 组/);
  assert.match(node.detail, /H.*首次.*(?:已验|验收|完成)/);
  assert.match(node.detail, /9 月 8 日.*冷备.*完成/);
  assert.match(node.detail, /之后的新增量.*另次备份/);
  assert.doesNotMatch(node.detail, /H 尚未返回|首次 H.*尚未验收/);
  assert.match(node.detail, /应用真正看见数据/);
});

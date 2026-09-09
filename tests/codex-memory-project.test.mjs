// tests/codex-memory-project.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { codexMemoryModules, codexMemoryProject } from "../app/content-codex-memory.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = codexMemoryModules.map((item) => item.slug);

test("codex-memory is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const finalOrder = JSON.parse(await readFile(path.join(projectRoot, "config", "final-project-order.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "codex-memory");
  assert.ok(registration, "codex-memory missing from panel-projects.json");
  assert.deepEqual(
    {
      id: registration.id,
      order: registration.order,
      title: registration.title,
      enabled: registration.enabled,
      presentationMode: registration.presentation_mode,
      route: registration.route,
      contentPath: registration.ai_refresh.content_path,
      repo: registration.source.repo,
      visibility: registration.source.visibility,
      defaultBranch: registration.source.default_branch,
      localRoot: registration.source.local_root
    },
    {
      id: "codex-memory",
      order: 20,
      title: "AI 工作区备份与恢复",
      enabled: true,
      presentationMode: "real_dashboard",
      route: "/projects/codex-memory",
      contentPath: "app/content-codex-memory.js",
      repo: "wlyaaaaa/codex-memory",
      visibility: "PRIVATE",
      defaultBranch: "main",
      localRoot: "E:\\Projects\\Backups\\codex-memory"
    }
  );
  const planEntry = finalOrder.projects.find((item) => item.id === "codex-memory");
  assert.ok(planEntry);
  assert.equal(planEntry.final_rank, 20);
  assert.equal(planEntry.state, "published");
  assert.ok(projectCatalog.some((item) => item.project.slug === "codex-memory"));
});

test("codex-memory keeps the accepted module routes and three reading layers", async () => {
  assert.equal(moduleSlugs.length, 7);
  assert.deepEqual(moduleSlugs, [
    "config-memory-whitelist-sync",
    "vss-conversation-hot-backup",
    "content-addressed-storage-cold-sync",
    "isolated-disaster-recovery",
    "gemini-workspace-memory",
    "claude-project-memory",
    "openclaw-workspace-recovery"
  ]);
  assert.equal(new Set(moduleSlugs).size, moduleSlugs.length, "module slugs must remain unique");
  assert.ok(routePaths.includes(codexMemoryProject.route));
  for (const slug of moduleSlugs) {
    assert.ok(routePaths.includes(`${codexMemoryProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof codexMemoryProject[field], "string");
    assert.notEqual(codexMemoryProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(codexMemoryProject[field]) && codexMemoryProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(codexMemoryProject.usageExamples.map((item) => item.moduleSlug)), new Set(moduleSlugs));
  for (const module of codexMemoryModules) {
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug} missing ${field}`);
      assert.notEqual(module[field].trim(), "");
    }
    for (const listField of ["decisionImpact", "implementation", "flow", "concepts"]) {
      assert.ok(Array.isArray(module[listField]) && module[listField].length > 0, `${module.slug} missing ${listField}`);
    }
    for (const key of ["entities", "failureRecovery", "intents", "relations"]) {
      assert.ok(module.searchProjection[key].length > 0, `${module.slug}.${key} is empty`);
    }
  }
});

test("codex-memory distinguishes current source inventory from the published backup point", () => {
  assert.equal(codexMemoryProject.currentPointId, "20260909T041508Z-68deef6b");
  assert.equal(codexMemoryProject.conversationFileCount, 7016);
  assert.equal(codexMemoryProject.conversationTotalSizeBytes, 47388350429);
  assert.equal(codexMemoryProject.liveSourceFileCount, 7067);
  assert.equal(codexMemoryProject.liveSourceTotalSizeBytes, 48020575000);
  assert.notEqual(codexMemoryProject.conversationFileCount, codexMemoryProject.liveSourceFileCount);
  const hotEntry = codexMemoryProject.operationalEntrypoints.find((item) => item.command.includes("-Mode Hot"));
  assert.ok(hotEntry && hotEntry.command.includes("-Execute"), "real Hot capture requires the source execution switch");
  assert.match(codexMemoryProject.currentSnapshot.boundary, /未打开备份正文或执行备份\/恢复/);
  assert.equal(codexMemoryProject.scheduledTasks.find((item) => item.owner === "PCConfig").currentHAvailable, false);
  assert.match(codexMemoryProject.currentSnapshot.boundary, /G仍为7016文件[\s\S]*活动源已到7067文件[\s\S]*H当前不可用/);
});

test("codex-memory explains core safety rules without marketing riddles", () => {
  const text = JSON.stringify({ project: codexMemoryProject, modules: codexMemoryModules });
  for (const expected of [
    "小文件不覆盖大文件",
    "raw_memories",
    "fail-closed",
    "vss_crash_consistent",
    "cold-payload",
    "H_unavailable",
    "DestinationRoot",
    "CanonicalCodexHome",
    "Codex Memory Backup",
    "CodexConversationBackup-Hot-Daily",
    "AIRecoveryColdSync-Daily"
  ]) {
    assert.ok(text.includes(expected), `codex-memory missing expected reality fact: ${expected}`);
  }
});

test("codex-memory first visible labels follow glossing and plain language", () => {
  const text = JSON.stringify({ project: codexMemoryProject, modules: codexMemoryModules });
  assert.match(text, /VSS（卷影复制服务）/);
  assert.match(text, /CAS（内容寻址存储）/);
  assert.match(text, /SHA-256（安全哈希算法 256 位）/);
  assert.match(text, /BitLocker（Windows 驱动器加密技术）/);
  assert.match(text, /fail-closed（失败关闭）/);
});

test("codex-memory search reaches owning modules and project page", () => {
  const queries = [
    ["Codex重装电脑后怎么快速恢复配置记忆和历史对话", "/projects/codex-memory"],
    ["怎样把Codex的自定义Skill和长期记忆备份到私有GitHub", "/projects/codex-memory/config-memory-whitelist-sync"],
    ["Codex正在使用时怎样无损备份几万条历史会话", "/projects/codex-memory/vss-conversation-hot-backup"],
    ["几十G的Codex会话记录怎么去重存放防止爆盘", "/projects/codex-memory/content-addressed-storage-cold-sync"],
    ["怎样把备份的历史Codex会话恢复出来查看", "/projects/codex-memory/isolated-disaster-recovery"]
  ];

  for (const [query, expectedRoute] of queries) {
    const results = searchPanel(query);
    assert.ok(results.length > 0, `Search returned 0 results for: ${query}`);
    assert.ok(
      results.some((item) => item.href === expectedRoute || item.href.startsWith(codexMemoryProject.route)),
      `Search for "${query}" did not reach ${expectedRoute}. Top result: ${results[0]?.href}`
    );
  }
});

test("System links its Domain 07 asset to the codex-memory project page", () => {
  const domain07 = systemProjectDomains.find((domain) => domain.id === "backup-and-secrets");
  assert.ok(domain07, "backup-and-secrets domain missing");
  const asset = domain07.assets.find((item) => item.id === "ai-memory-backup-b");
  assert.ok(asset, "existing Codex memory asset missing from Domain 07");
  assert.equal(asset.href, "/projects/codex-memory");
});

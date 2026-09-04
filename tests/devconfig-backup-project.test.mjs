import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { devconfigBackupModules, devconfigBackupProject } from "../app/content-devconfig-backup.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = devconfigBackupModules.map((item) => item.slug);

test("devconfig-backup is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const finalOrder = JSON.parse(await readFile(path.join(projectRoot, "config", "final-project-order.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "devconfig-backup");
  assert.ok(registration, "devconfig-backup missing from panel-projects.json");
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
      id: "devconfig-backup",
      order: 12,
      title: "DevConfig Backup",
      enabled: true,
      presentationMode: "real_dashboard",
      route: "/projects/devconfig-backup",
      contentPath: "app/content-devconfig-backup.js",
      repo: "wlyaaaaa/devconfig-backup",
      visibility: "PUBLIC",
      defaultBranch: "main",
      localRoot: "E:\\Projects\\Backups\\devconfig-backup"
    }
  );
  const planEntry = finalOrder.projects.find((item) => item.id === "devconfig-backup");
  assert.ok(planEntry);
  assert.equal(planEntry.final_rank, 12);
  assert.equal(planEntry.state, "published");
  assert.ok(projectCatalog.some((item) => item.project.slug === "devconfig-backup"));
});

test("devconfig-backup keeps the accepted module routes and three reading layers", async () => {
  assert.equal(moduleSlugs.length, 4);
  assert.deepEqual(moduleSlugs, [
    "tiered-distribution",
    "source-catalog",
    "wechat-native-backup",
    "recovery-and-tasks"
  ]);
  assert.equal(new Set(moduleSlugs).size, moduleSlugs.length, "module slugs must remain unique");
  assert.ok(routePaths.includes(devconfigBackupProject.route));
  for (const slug of moduleSlugs) {
    assert.ok(routePaths.includes(`${devconfigBackupProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof devconfigBackupProject[field], "string");
    assert.notEqual(devconfigBackupProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(devconfigBackupProject[field]) && devconfigBackupProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(devconfigBackupProject.usageExamples.map((item) => item.moduleSlug)), new Set(moduleSlugs));
  for (const module of devconfigBackupModules) {
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

test("devconfig-backup explains tiered media architecture and cold drive separation", () => {
  const text = JSON.stringify({ project: devconfigBackupProject, modules: devconfigBackupModules });
  for (const expected of [
    "80_Backup",
    "Google Drive",
    "rclone",
    "latest.zip",
    "latest.sha256",
    "rclone-remote-binding.json",
    "BitLocker",
    "PCConfig",
    "冷备",
    "零流量",
    "21:05",
    "22:00",
    "1,911.3 MB",
    "DevConfigBackup-Drive-Daily",
    "最近返回 1"
  ]) {
    assert.ok(text.includes(expected), `devconfig-backup omits tiered distribution keyword: ${expected}`);
  }
  assert.match(text, /本仓库不直写\s*H|本仓库[^。]{0,40}不写\s*H|不向\s*H\s*盘写入/, "devconfig-backup must state that its tasks do not write H");
});

test("devconfig-backup explains data-driven catalog and cache exclusions", () => {
  const text = JSON.stringify({ project: devconfigBackupProject, modules: devconfigBackupModules });
  for (const expected of [
    "sources.psd1",
    "PowerToys",
    "JetBrains",
    "Docker",
    "docker_data.vhdx",
    "FinalShell",
    "PixPin",
    "Clash",
    "node_modules",
    "Assert-NoBackupArtifacts",
    "scoop export",
    "winget export"
  ]) {
    assert.ok(text.includes(expected), `devconfig-backup omits catalog exclusion keyword: ${expected}`);
  }
});

test("devconfig-backup explains WeChat modes, file-level increment and WAL non-exclusion limits", () => {
  const text = JSON.stringify({ project: devconfigBackupProject, modules: devconfigBackupModules });
  for (const expected of [
    "41.89 GB",
    "xwechat_files",
    "robocopy",
    "checksum",
    "8G",
    "保险丝",
    "WAL",
    "SHM",
    "Backup-WeChat.ps1",
    "wechat.hot-backup-receipt.v1",
    "payload_names_emitted",
    "-DbOnly",
    "-DriveFull",
    "-MaxTransfer 0",
    "累计流量"
  ]) {
    assert.ok(text.includes(expected), `devconfig-backup omits WeChat backup keyword: ${expected}`);
  }
});

test("devconfig-backup explains disaster recovery runbook and two critical traps", () => {
  const text = JSON.stringify({ project: devconfigBackupProject, modules: devconfigBackupModules });
  for (const expected of [
    "7 步",
    "Documents",
    "10979",
    "Restore-WeChat.ps1",
    ".pre-restore-",
    "COPY_COMPLETE_AWAITING_HUMAN_ACCEPTANCE",
    "wscript.exe",
    "PowerShell 7",
    "Setup-ScheduledTasks.ps1",
    "wlyaaaaa/PCConfig",
    "7z t",
    "强来源哈希"
  ]) {
    assert.ok(text.includes(expected), `devconfig-backup omits recovery runbook keyword: ${expected}`);
  }
});

test("devconfig-backup search reaches the owning modules and handles natural requests", () => {
  const queries = [
    ["重装电脑后怎么快速还原开发环境和凭据", "/projects/devconfig-backup"],
    ["换新电脑一键恢复开发配置和微信数据", "/projects/devconfig-backup"],
    ["sources.psd1", "/projects/devconfig-backup"],
    ["Restore-WeChat", "/projects/devconfig-backup"]
  ];
  for (const [query, expectedHref] of queries) {
    const results = searchPanel(query);
    assert.ok(results.length > 0, `empty search for query: ${query}`);
    assert.ok(
      results.slice(0, 3).some((item) => item.href.startsWith(expectedHref)),
      `query "${query}" did not return ${expectedHref} in top 3 results`
    );
  }
});

test("System links its devconfig-backup asset to the new detail page", () => {
  const backupDomain = systemProjectDomains.find((domain) => domain.id === "backup-and-secrets");
  assert.ok(backupDomain);
  const asset = backupDomain.assets.find((item) => item.id === "devconfig-backup");
  assert.ok(asset);
  assert.equal(asset.href, "/projects/devconfig-backup");
});

test("devconfig-backup separates current runtime evidence from routes and guarantees", () => {
  const text = JSON.stringify({ project: devconfigBackupProject, modules: devconfigBackupModules });
  assert.match(text, /3 个返回 0[^。]{0,80}配置 Drive 返回 1/);
  assert.match(text, /临时云监控[^。]{0,40}已禁用|WeChatDrive-Monitor-Hourly[^。]{0,80}当前已禁用/);
  assert.match(text, /运行中复制[^。]{0,60}(?:不等于|不能保证).*一致/);
  assert.match(text, /完整新机恢复未实机验收|整套恢复[^。]{0,40}不等于/);
  assert.match(text, /远端 latest[^。]{0,80}9 月 2 日[^。]{0,80}落后|Drive latest[^。]{0,80}9 月 2 日/);
  assert.match(text, /H_unavailable/);
  assert.match(text, /additive_no_mirror/);
  assert.match(text, /每个新代[^。]{0,80}完整上传|完整上传[^。]{0,80}日期包/);
  assert.match(text, /reparse point|重解析点/);
  assert.match(text, /\.failed-restore-/);
  assert.match(text, /-DriveOnly/);
  assert.doesNotMatch(text, /wlyaaaaaa@gmail/i, "private remote alias must not enter public content");
  assert.doesNotMatch(text, /公开发布 100% 安全|半小时满血|上传云端仅需十几秒/);
});

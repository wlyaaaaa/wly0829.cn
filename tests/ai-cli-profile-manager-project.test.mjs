import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { aiCliProfileManagerModules, aiCliProfileManagerProject } from "../app/content-ai-cli-profile-manager.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains, systemProjectInventory } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "profiles-launch",
  "engines-providers",
  "secrets-isolation",
  "doctor-validation",
  "recoverable-runs",
  "local-proxies",
  "install-recovery"
];
const expectedPublicProfileIds = [
  "codex-official",
  "codex-qwen3-7-max-paygo",
  "codex-qwen3-8-max-paygo",
  "codex-deepseek",
  "codex-deepseek-v4-pro",
  "codex-ollama-main",
  "codex-ollama-review",
  "codex-ollama-qwen3-8-27b",
  "codex-spark-xhigh",
  "claude-official",
  "claude-deepseek",
  "claude-custom",
  "claude-ollama",
  "claude-ollama-main",
  "claude-chatgpt-ccp",
  "claude-chatgpt-cliproxy",
  "oi-deepseek",
  "oi-ollama",
  "qwen-code-ollama-main",
  "opencode-ollama-main",
  "opencode-ollama-qwen3-8-27b"
];

test("AI CLI Profile Manager is registered as the twentieth public project", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "ai-cli-profile-manager");
  assert.ok(registration, "AI CLI Profile Manager registry entry is missing");
  assert.deepEqual(
    {
      id: registration.id,
      order: registration.order,
      title: registration.title,
      enabled: registration.enabled,
      presentation_mode: registration.presentation_mode,
      route: registration.route,
      content_path: registration.ai_refresh.content_path,
      repo: registration.source.repo,
      visibility: registration.source.visibility,
      default_branch: registration.source.default_branch,
      local_root: registration.source.local_root
    },
    {
      id: "ai-cli-profile-manager",
      order: 20,
      title: "AI CLI Profile Manager",
      enabled: true,
      presentation_mode: "real_dashboard",
      route: "/projects/ai-cli-profile-manager",
      content_path: "app/content-ai-cli-profile-manager.js",
      repo: "wlyaaaaa/ai-cli-profile-manager",
      visibility: "PUBLIC",
      default_branch: "main",
      local_root: "E:\\Projects\\Tools\\ai-cli-profile-manager"
    }
  );
  assert.equal(aiCliProfileManagerProject.slug, registration.id);
  assert.equal(aiCliProfileManagerProject.order, registration.order);
  assert.equal(projectCatalog.at(-1)?.project.slug, "ai-cli-profile-manager");
  assert.equal(systemProjectInventory.detailedPageCount, 20);
});

test("AI CLI Profile Manager exposes seven source-backed modules and all three reading layers", async () => {
  assert.deepEqual(aiCliProfileManagerModules.map((item) => item.slug), expectedModuleSlugs);
  assert.ok(routePaths.includes(aiCliProfileManagerProject.route));
  for (const slug of expectedModuleSlugs) {
    assert.ok(routePaths.includes(`${aiCliProfileManagerProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof aiCliProfileManagerProject[field], "string");
    assert.notEqual(aiCliProfileManagerProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples"]) {
    assert.ok(Array.isArray(aiCliProfileManagerProject[field]) && aiCliProfileManagerProject[field].length > 0, `missing project field: ${field}`);
  }
  for (const module of aiCliProfileManagerModules) {
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug} missing ${field}`);
      assert.notEqual(module[field].trim(), "");
    }
  }
  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "ai-cli-profile-manager", "index.html"), "utf8");
  for (const layer of ["quick", "product", "technical"]) {
    assert.match(overviewHtml, new RegExp(`data-project-reading-panel="${layer}"`));
  }
});

test("AI CLI Profile Manager keeps source, install, runtime and Live evidence separate", () => {
  const snapshot = aiCliProfileManagerProject.currentSnapshot;
  assert.deepEqual(aiCliProfileManagerProject.cardMetrics, snapshot.metrics.map(({ label, value }) => ({ label, value })));
  assert.deepEqual(aiCliProfileManagerProject.heroFacts, snapshot.facts.filter((fact) => fact.hero).map(({ label, value }) => ({ label, value })));
  const text = JSON.stringify({ project: aiCliProfileManagerProject, modules: aiCliProfileManagerModules });
  for (const expected of ["88f72e668bcfc8499b89f390343bae909e50db1c", "385 / 385", "0.153.0", "21 个", "73/73", "danger-full-access", "approvalPolicy=never", "thread/session", "--no-web-search", "DPAPI", "SecretRef", "ccp 0.1.15", "cliproxy 7.2.72", "本轮没有执行任何付费或远程模型 Live Test"]) {
    assert.ok(text.includes(expected), `AI CLI Profile Manager omits current evidence or boundary: ${expected}`);
  }
  assert.match(text, /交互式 start.*上游权限.*machine run.*danger-full-access/s);
  assert.match(text, /source.*安装.*runtime.*Live|源码.*安装态.*当前 CLI.*Live/s);
  assert.match(text, /不自动.*(?:fallback|回退)|no-fallback/s);
});

test("AI CLI Profile Manager exposes all 21 public Profile identities without upgrading them to current Live", () => {
  const engines = aiCliProfileManagerModules.find((item) => item.slug === "engines-providers");
  const matrix = engines.implementation.join("\n");
  for (const id of expectedPublicProfileIds) assert.ok(matrix.includes(id), `public Profile matrix misses ${id}`);
  assert.equal(expectedPublicProfileIds.length, 21);
  assert.match(matrix, /source\/static.*installed\/runtime.*当前 Live/s);
  assert.match(matrix, /machine-only=是.*start=否.*exact resume=否/s);
  assert.match(matrix, /Rust Open Interpreter.*0\.0\.40/s);
  assert.match(JSON.stringify(engines), /旧 Python 0\.4\.x.*(?:拒绝|不支持)/s);
  assert.doesNotMatch(matrix, /21 个.*当前 Live 通过/);
});

test("AI CLI Profile Manager explains OpenClaw import, Profile deletion, manuals and the complete command result surface", () => {
  const text = JSON.stringify({ project: aiCliProfileManagerProject, modules: aiCliProfileManagerModules });
  for (const expected of ["Import-FromOpenClaw.ps1", "api.deepseek.com", "-Apply", "-Force", "codex-deepseek-v4-pro", "profile set-default", "profile remove", "最后一个引用", "Rust Open Interpreter", "旧 Python 0.4.x", "AI CLI Profile Manager 使用手册", "Codex、Claude Code 与 Open Interpreter CLI 中文手册", "0=成功", "6=用户取消"]) {
    assert.ok(text.includes(expected), `AI CLI Profile Manager omits product lifecycle detail: ${expected}`);
  }
  assert.match(aiCliProfileManagerProject.summary, /交互式 start.*权限由原生 CLI.*程序化 Codex run.*回读实际模型.*完全访问权限/s);
  assert.doesNotMatch(aiCliProfileManagerProject.summary, /每次运行都核对.*权限/);
});

test("AI CLI Profile Manager search uses explicit projections and natural requests reach the owning routes", async () => {
  const keys = ["entities", "failureRecovery", "intents", "relations"];
  for (const module of aiCliProfileManagerModules) {
    assert.deepEqual(Object.keys(module.searchProjection).sort(), keys);
    for (const key of keys) assert.ok(module.searchProjection[key].length > 0, `${module.slug}.${key} is empty`);
  }
  const cases = [
    ["切换不同AI命令行但不要污染官方登录", "/projects/ai-cli-profile-manager/profiles-launch"],
    ["检查Profile为什么不能用但不要付费测试", "/projects/ai-cli-profile-manager/doctor-validation"],
    ["怎样导出不用aicli的原生启动配方", "/projects/ai-cli-profile-manager/profiles-launch"],
    ["把OpenClaw里的DeepSeek配置先预览再导入", "/projects/ai-cli-profile-manager/profiles-launch"],
    ["Codex中断后只恢复同一个thread", "/projects/ai-cli-profile-manager/recoverable-runs"],
    ["代理装了但没运行也不要自动切换", "/projects/ai-cli-profile-manager/local-proxies"]
  ];
  for (const [query, href] of cases) {
    assert.ok(searchPanel(query).slice(0, 5).some((entry) => entry.href === href), `search misses ${query}`);
  }
  const asset = await readFile(path.join(projectRoot, "dist", "search-project-ai-cli-profile-manager.js"), "utf8");
  const match = asset.match(/^window\.__WLY_PROJECT_SEARCH_INDEX__=([\s\S]*);\s*$/);
  assert.ok(match);
  assert.deepEqual(JSON.parse(match[1]).map((item) => item.href), expectedModuleSlugs.map((slug) => `/projects/ai-cli-profile-manager/${slug}/`));
});

test("System links its existing AI CLI asset to the project page", () => {
  const asset = systemProjectDomains.flatMap((domain) => domain.assets).find((item) => item.id === "ai-cli-profile-manager");
  assert.ok(asset);
  assert.equal(asset.href, "/projects/ai-cli-profile-manager");
  assert.match(asset.role, /Profile.*体检.*可恢复 Codex/);
});

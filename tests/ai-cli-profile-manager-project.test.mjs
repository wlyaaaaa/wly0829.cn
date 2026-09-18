import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { aiCliProfileManagerModules, aiCliProfileManagerProject } from "../app/content-ai-cli-profile-manager.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "profiles-launch",
  "engines-providers",
  "secrets-isolation",
  "doctor-validation",
  "recoverable-runs",
  "local-proxies",
  "install-recovery",
  "native-desktop-integration",
  "background-openai-children"
];
const expectedPublicProfileIds = [
  "codex-official",
  "codex-qwen3-7-max-paygo",
  "codex-qwen3-8-max-paygo",
  "codex-glm-5-3",
  "codex-glm-5-3-flash",
  "codex-deepseek-flash",
  "codex-deepseek-v4-pro",
  "codex-ollama-main",
  "codex-ollama-review",
  "codex-ollama-qwen3-8-27b",
  "codex-ollama-qwen3-6-35b-abliterated",
  "codex-ollama-qwen3-8-27b-abliterated",
  "codex-spark-xhigh",
  "claude-official",
  "claude-custom",
  "claude-ollama",
  "claude-ollama-main",
  "claude-chatgpt-ccp",
  "claude-chatgpt-cliproxy",
  "oi-ollama",
  "qwen-code-ollama-main",
  "opencode-ollama-main",
  "opencode-ollama-qwen3-8-27b"
];

test("AI CLI Profile Manager is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "ai-cli-profile-manager");
  assert.ok(registration, "AI CLI Profile Manager registry entry is missing");
  assert.deepEqual(
    {
      id: registration.id,
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
  assert.ok(projectCatalog.some((entry) => entry.project.slug === "ai-cli-profile-manager"));
});

test("AI CLI Profile Manager exposes nine source-backed modules and all three reading layers", async () => {
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
  for (const expected of ["37c7d4713b1324d8371e7c64efb19f0def83b7e1", "385/385", "0.154.0-alpha.6.2", "23份公开", "73/73", "danger-full-access", "approvalPolicy=never", "thread/session", "--no-web-search", "DPAPI", "SecretRef", "本网页没有重发付费调用", "6ef0e67dbff75135", "旧Desktop进程"]) {
    assert.ok(text.includes(expected), `AI CLI Profile Manager omits current evidence or boundary: ${expected}`);
  }
  assert.match(text, /交互式 start.*上游权限.*程序化执行层.*danger-full-access/s);
  assert.match(text, /配置状态.*源码实现.*安装.*实际进程.*Live/s);
  assert.match(text, /不自动.*(?:fallback|回退)|no-fallback/s);
});

test("AI CLI Profile Manager exposes all 23 public Profile identities without upgrading them to current Live", () => {
  const engines = aiCliProfileManagerModules.find((item) => item.slug === "engines-providers");
  const matrix = engines.implementation.join("\n");
  for (const id of expectedPublicProfileIds) assert.ok(matrix.includes(id), `public Profile matrix misses ${id}`);
  assert.equal(expectedPublicProfileIds.length, 23);
  assert.match(matrix, /源码.*安装.*真实/s);
  const continuity = JSON.stringify({ example: engines.example, result: engines.result, flow: engines.flow, implementation: engines.implementation, verification: engines.verification });
  for (const expected of ["LaunchPlan.continuityPolicy", "existing-project-state", "secondFactSource=false", "git status", "git diff", "983616", "20000", "16384", "prune=false"]) {
    assert.ok(continuity.includes(expected), `third-party continuity explanation misses ${expected}`);
  }
  assert.match(engines.result, /AICLI只附策略与窗口设置，不自动写/);
  assert.match(engines.result, /官方OpenAI Codex和Anthropic Claude保持自己的原生/);
  assert.ok(aiCliProfileManagerProject.usageExamples.some((item) => item.moduleSlug === engines.slug && item.ask.includes("上下文")));
  assert.match(matrix, /machine-only.*不是交互式start/s);
  assert.match(matrix, /Rust Open Interpreter.*0\.0\.40/s);
  assert.match(JSON.stringify(engines), /旧 Python 0\.4\.x.*(?:拒绝|不支持)/s);
  assert.doesNotMatch(matrix, /21 个.*当前 Live 通过/);
});

test("AI CLI Profile Manager explains OpenClaw import, Profile deletion, manuals and the complete command result surface", () => {
  const text = JSON.stringify({ project: aiCliProfileManagerProject, modules: aiCliProfileManagerModules });
  for (const expected of ["Import-FromOpenClaw.ps1", "api.deepseek.com", "-Apply", "-Force", "codex-deepseek-v4-pro", "profile set-default", "profile remove", "最后一个引用", "Rust Open Interpreter", "旧 Python 0.4.x", "AI CLI Profile Manager 使用手册", "Codex、Claude Code 与 Open Interpreter CLI 中文手册", "0=成功", "6=用户取消"]) {
    assert.ok(text.includes(expected), `AI CLI Profile Manager omits product lifecycle detail: ${expected}`);
  }
  assert.match(aiCliProfileManagerProject.summary, /原生 Codex.*Claude Code.*官方 Codex 桌面/s);
  assert.match(text, /程序化 Codex 权限.*danger-full-access.*approvalPolicy=never/s);
  assert.match(text, /现场回读实际模型/);
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
  assert.match(asset.role, /Profile.*体检.*可恢复Codex/s);
});

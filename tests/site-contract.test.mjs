import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ruleGuides } from "../app/content-rule-guides.js";
import { chineseAsrModules, chineseAsrProject } from "../app/content-chinese-asr.js";
import { githubIndexModules, githubIndexProject } from "../app/content-github-index.js";
import { pcconfigModules, pcconfigProject } from "../app/content-pcconfig.js";
import { skillGuides, skillOutcomes } from "../app/content-skill-guides.js";
import { searchPanel } from "../app/search.js";
import { createTermAnnotator } from "../app/term-annotator.js";
import {
  canonicalUrl,
  excludedSkills,
  modules,
  panelSnapshot,
  primaryNav,
  project,
  projectCatalog,
  projects,
  routeMeta,
  routePaths,
  rulesSnapshot,
  skills
} from "../app/site-content.js";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");

const forbiddenPublicTerms = [
  "Q29kZXg=",
  "Q29kZXhIYXJuZXNz",
  "UGVyc29uYWxPUw==",
  "UGVyc29uYWxLbm93bGVkZ2VCYXNl",
  "cGVyc29uYWwtbGl0aWdhdGlvbg==",
  "6K+J6K68",
  "QUkg5aSn5qih5Z6L",
  "QUnlpKfmqKHlnos=",
  "QUkg5pWZ57uD",
  "QUnmlZnnu4M="
].map((value) => Buffer.from(value, "base64").toString("utf8"));

function assertForbiddenTermsAreAbsent(text) {
  for (const term of forbiddenPublicTerms) {
    assert.ok(!text.toLowerCase().includes(term.toLowerCase()), `public content contains excluded term: ${term}`);
  }
}

function assertReaderStates(states, label) {
  const keys = ["pass", "problem", "unavailable"];
  const values = keys.map((key) => states?.[key]);
  for (const [index, value] of values.entries()) {
    assert.equal(typeof value, "string", `${label} reader state ${keys[index]} is missing`);
    assert.notEqual(value.trim(), "", `${label} reader state ${keys[index]} is empty`);
  }
  assert.equal(new Set(values).size, values.length, `${label} reader states must describe three different outcomes`);
}

function impactPatternMatches(pattern, candidate) {
  const normalized = pattern.replaceAll("\\", "/");
  let expression = "^";
  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    if (character === "*" && normalized[index + 1] === "*") {
      expression += ".*";
      index += 1;
    } else if (character === "*") expression += "[^/]*";
    else expression += character.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  }
  return new RegExp(`${expression}$`, "i").test(candidate.replaceAll("\\", "/"));
}

test("the accepted panel has exactly four projects and three navigation areas", () => {
  assert.deepEqual(projects.map((item) => item.slug), ["agents", "pcconfig", "github-index", "chinese-asr"]);
  assert.deepEqual(projects.map((item) => item.order), [1, 2, 3, 4]);
  assert.equal(project.slug, "agents");
  assert.deepEqual(primaryNav.map((item) => item.label), ["项目", "规则", "Skills（能力）"]);
  assert.ok(!routePaths.includes("/ideas"));
  assert.ok(!routePaths.some((route) => route.startsWith("/ideas/")));
});

test("the project card exposes visible module links instead of a dropdown", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /project-module-link-row/);
  assert.match(pageSource, /moduleOptions\.slice\(index \* 7, index \* 7 \+ 7\)/);
  assert.match(pageSource, /projectCatalog\.map\(\(entry\) => <ProjectCard/);
  assert.match(pageSource, /currentProject\.route/);
  assert.match(pageSource, /project-repository-button/);
  assert.match(pageSource, /project-hero-repository-link/);
  assert.match(pageSource, /https:\/\/github\.com\/\$\{entry\.registration\.source\.repo\}/);
  assert.doesNotMatch(pageSource, /project-module-selector|选择 \.agents 模块/);
  assert.doesNotMatch(pageSource, /href=\{`\/projects\/agents\//);
});

test("term annotation is longest-match and never annotates its own translation", () => {
  const annotate = createTermAnnotator([
    ["saved local Git project", "已保存的本地 Git 项目"],
    ["Current task", "当前任务"],
    ["worktree", "Git 工作树"],
    ["Git", "版本管理系统"],
    ["Current", "当前状态"],
    ["task", "任务"]
  ]);
  assert.equal(annotate("Current task"), "Current task（当前任务）");
  assert.equal(annotate("worktree"), "worktree（Git 工作树）");
  assert.equal(annotate("saved local Git project"), "saved local Git project（已保存的本地 Git 项目）");
  assert.equal(annotate("Git（版本管理系统）"), "Git（版本管理系统）");
  for (const value of ["Current task", "worktree", "saved local Git project", "Git（版本管理系统）"]) {
    const once = annotate(value);
    assert.equal(annotate(once), once, `${value} annotation is not idempotent`);
  }
});

test("reader outcomes appear before technical decision lists", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /module\.result[\s\S]{0,700}<ThreeStateSummary \{\.\.\.module\.readerStates\} \/>[\s\S]{0,300}module\.decisionImpact/);
  assert.match(pageSource, /outcome\.result[\s\S]{0,700}<ThreeStateSummary \{\.\.\.outcome\.readerStates\} \/>[\s\S]{0,400}outcome\.changes/);
});

test("every project first viewport exposes current decision-critical choices", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /currentProject\.heroFacts/);
  assert.match(pageSource, /project-headline-facts/);
  for (const entry of projectCatalog) {
    assert.ok(Array.isArray(entry.project.heroFacts) && entry.project.heroFacts.length >= 4, `${entry.project.slug} hides current choices from the first viewport`);
    for (const fact of entry.project.heroFacts) {
      assert.ok(fact.label?.length >= 2, `${entry.project.slug} has an unnamed first-viewport fact`);
      assert.ok(fact.value?.length >= 18, `${entry.project.slug}/${fact.label} is too vague`);
    }
  }
  const asrFacts = chineseAsrProject.heroFacts.map((fact) => fact.value).join("\n");
  for (const model of ["SenseVoiceSmall", "Qwen3-ASR-1.7B", "FireRedASR2-LLM", "Paraformer", "CAM++", "Qwen Audio 3.0 ASR Flash", "Fun-ASR-Nano-2512", "Whisper Large V3"]) {
    assert.ok(asrFacts.includes(model), `ChineseASR first viewport hides model: ${model}`);
  }
  const pcconfigFacts = pcconfigProject.heroFacts.map((fact) => fact.value).join("\n");
  assert.match(pcconfigFacts, /85.*81/);
  assert.match(pcconfigFacts, /第 68 版 normal/);
  assert.match(pcconfigFacts, /Vault V2/);
  const gitFacts = githubIndexProject.heroFacts.map((fact) => fact.value).join("\n");
  assert.match(gitFacts, /45.*26.*19/);
  assert.match(gitFacts, /43 个 clone occurrence/);
  const agentsFacts = project.heroFacts.map((fact) => fact.value).join("\n");
  assert.ok(agentsFacts.includes(panelSnapshot.authority.releaseId));
  assert.ok(agentsFacts.includes(panelSnapshot.authority.previous.release_id));
  assert.match(agentsFacts, /24.*22/);
  assert.doesNotMatch(pageSource, /C:\\\\ProgramData\\\\PCConfig\\\\AuthorityHost\\\\policy\\\\generations/);
});

test("context-dependent terms are not assigned one false global meaning", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.doesNotMatch(pageSource, /\["Authority",\s*"活动规则权威"\]/);
  assert.doesNotMatch(pageSource, /\["source",\s*"来源"\]/);
  assert.doesNotMatch(pageSource, /\["token",/);
  assert.doesNotMatch(pageSource, /\["Owner",/);
  assert.doesNotMatch(pageSource, /\["candidate",/);
  assert.doesNotMatch(pageSource, /\["Root",/);
  assert.doesNotMatch(pageSource, /\["Child",/);
  assert.doesNotMatch(pageSource, /\["Provider",/);
  assert.doesNotMatch(pageSource, /\["projection",/i);
  assert.doesNotMatch(pageSource, /\["scope",/i);
  assert.doesNotMatch(pageSource, /\["limit",/i);
  assert.doesNotMatch(pageSource, /\["profile",/i);
  assert.match(pageSource, /\["effect authority",\s*"动作授权"\]/);
  assert.match(pageSource, /\["highest authority",\s*"最高权限身份"\]/);
  assert.match(pageSource, /Transaction（供应事务）/);
  assert.match(pageSource, /skill-regression-evidence/);
  const translationTerms = [...pageSource.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)].map((match) => match[1].toLowerCase());
  assert.equal(new Set(translationTerms).size, translationTerms.length, "term translation table contains duplicate meanings");

  const bySlug = Object.fromEntries(modules.map((item) => [item.slug, item]));
  assert.ok(bySlug["rules-contracts"].flow.some((item) => item.includes("Provider（事实入口）")));
  assert.ok(bySlug["capability-routing"].decisionImpact.some((item) => item.includes("Owner（责任源）入口")));
  assert.ok(bySlug["authorization-owner"].implementation.some((item) => item.includes("scope（施工范围）")));
    assert.ok(bySlug["protected-policy"].implementation.some((item) => item.includes("current-rules.json")));
  assert.ok(bySlug["skills-plugins"].decisionImpact.some((item) => item.includes("Source（源码）")));
  assert.ok(bySlug["context-evidence"].decisionImpact.some((item) => item.includes("跨 Owner（责任源）")));
});

test("project rules require professional, detailed and plain-language content", async () => {
  const projectRules = await readFile(path.join(projectRoot, "AGENTS.md"), "utf8");
  assert.match(projectRules, /professional_detailed_plain_language/);
  assert.match(projectRules, /what this thing actually does for[\s\S]{0,500}concrete problem or accident[\s\S]{0,500}realistic\s+example[\s\S]{0,500}owner receives/);
  assert.match(projectRules, /English（中文含义）/);
  assert.match(projectRules, /single-pass, longest-phrase safety net/);
  assert.match(projectRules, /Context-dependent words such as token, source, candidate/);
  assert.match(projectRules, /Owner, Provider, Authority and root/);
  assert.match(projectRules, /Field completeness,[\s\S]{0,200}correct terms do\s+not make that page understandable/);
  assert.match(projectRules, /Except for private sensitive payloads and reusable secrets/);
  assert.match(projectRules, /exact models,[\s\S]{0,260}providers,[\s\S]{0,260}versions,[\s\S]{0,400}E2E/);
  assert.match(projectRules, /first project viewport must disclose 4–6 decision-critical current facts/);
  assert.match(projectRules, /Public visibility is never a reason to suppress a non-secret fact/);
  assert.match(projectRules, /project default is `gpt-5\.6-sol` with `max` effort/);
  assert.match(projectRules, /One subagent owns one durable goal/);
  assert.match(projectRules, /clarify, narrow or expand[\s\S]{0,200}same goal/);
  assert.match(projectRules, /never replace that goal with an\s+unrelated objective/);
  assert.match(projectRules, /Accuracy remains the primary product requirement/);
  assert.match(projectRules, /restrictions\s+apply only to the prohibited literal or private value/);
  assert.match(projectRules, /must never change\s+the factual status, omit the component, soften a failure/);
  assert.ok(!projectRules.toLowerCase().includes(forbiddenPublicTerms[0].toLowerCase()));
  assert.ok(!projectRules.toLowerCase().includes(forbiddenPublicTerms[1].toLowerCase()));
});

test("the authoritative desktop scale is last in the cascade", async () => {
  const styles = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  const compactIndex = styles.lastIndexOf("Compact dashboard density");
  const scaleIndex = styles.lastIndexOf("Authoritative desktop scale");
  assert.ok(compactIndex >= 0 && scaleIndex > compactIndex, "desktop scale is overridden by an older compact block");
  const scaleBlock = styles.slice(scaleIndex);
  assert.match(scaleBlock, /@media \(min-width: 901px\)/);
  assert.match(scaleBlock, /--max-width:\s*1680px/);
  assert.match(scaleBlock, /body\s*\{\s*font-size:\s*18px/);
});

test("the initial bundle stays bounded before the lazy-load project threshold", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const assetsRoot = path.join(projectRoot, "dist", "assets");
  const javascript = (await readdir(assetsRoot)).filter((item) => item.endsWith(".js"));
  assert.equal(javascript.length, 1, "initial app currently expects one bounded eager chunk");
  const gzipBytes = gzipSync(await readFile(path.join(assetsRoot, javascript[0]))).length;
  assert.ok(gzipBytes <= registry.refresh_policy.initial_bundle_gzip_budget_kib * 1024, `initial JavaScript gzip ${gzipBytes} exceeds budget`);
  if (registry.projects.filter((item) => item.enabled).length >= registry.refresh_policy.lazy_detail_required_at_project_count) {
    const generatedIndex = await readFile(path.join(projectRoot, "app", "project-content-index.generated.js"), "utf8");
    assert.match(generatedIndex, /=>\s*import\(/, "project details must lazy-load before the configured project threshold");
  }
});

test("the maintenance registry drives exactly the four accepted project packages", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.schema, "wly.personal-panel-project-registry.v1");
  assert.equal(registry.refresh_policy.mode, "ai_managed_on_demand");
  assert.equal(registry.refresh_policy.semantic_writer, "website_ai_task_only");
  assert.match(registry.refresh_policy.full_refresh_rule, /unchanged projects remain byte-identical/);
  assert.match(registry.refresh_policy.anti_append_policy, /never append refresh logs/);
  assert.match(registry.refresh_policy.evolution_policy, /date or date range/);
  assert.match(registry.refresh_policy.rule_refresh_boundary, /verified current E release/);
  assert.equal(registry.refresh_policy.trigger, "displayed_fact_or_explanation_changed");
  assert.equal(registry.refresh_policy.only_private_document, "docs/design/private-content-rules.md");
  assert.equal(registry.refresh_policy.default_presentation_mode, "real_dashboard");
  assert.deepEqual(registry.projects.map((item) => item.id), ["agents", "pcconfig", "github-index", "chinese-asr"]);
  assert.deepEqual(registry.projects.map((item) => item.order), [1, 2, 3, 4]);
  assert.deepEqual(registry.projects.map((item) => item.route), ["/projects/agents", "/projects/pcconfig", "/projects/github-index", "/projects/chinese-asr"]);
  assert.deepEqual(projectCatalog.map((entry) => entry.registration.id), registry.projects.map((item) => item.id));
  for (const item of registry.projects) {
    assert.equal(item.enabled, true);
    assert.equal(item.presentation_mode, "real_dashboard");
    assert.match(item.ai_refresh.content_path, /^app\/content-[a-z-]+\.js$|^app\/content-core\.js$/);
    assert.ok(Number.isInteger(item.ai_refresh.semantic_revision) && item.ai_refresh.semantic_revision >= 1);
    assert.ok(item.ai_refresh.collectors.length >= 3);
    if (item.id !== "agents") assert.ok(item.ai_refresh.conditional_collectors.length >= 2);
    assert.ok(item.ai_refresh.scope.length >= 10);
    assert.ok(item.impact_sources.length >= 3);
  }
  assert.ok(registry.projects[0].impact_sources.length >= 5);
  assert.deepEqual(registry.projects.filter((item) => item.source.visibility === "PUBLIC").map((item) => item.id), ["github-index", "chinese-asr"]);
  assert.ok(!registry.projects.some((item) => item.id === "website"));

  const generatedIndex = await readFile(path.join(projectRoot, "app", "project-content-index.generated.js"), "utf8");
  for (const item of registry.projects) assert.ok(generatedIndex.includes(`["${item.id}"`), `generated project index is missing ${item.id}`);
  const generation = JSON.parse(execFileSync(process.execPath, [path.join(projectRoot, "scripts", "generate-project-content-index.mjs")], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
  assert.equal(generation.status, "no_change");

  for (const entry of projectCatalog) {
    const root = `${entry.registration.source.local_root.replaceAll("\\", "/")}/`;
    const patterns = entry.registration.impact_sources.flatMap((source) => source.paths || []);
    for (const module of entry.modules) {
      for (const source of module.sources) {
        const normalized = source.path.replaceAll("\\", "/");
        if (!normalized.toLowerCase().startsWith(root.toLowerCase())) continue;
        const relative = normalized.slice(root.length);
        assert.ok(patterns.some((pattern) => impactPatternMatches(pattern, relative)), `${entry.project.slug}/${module.slug} source is missing from impact_sources: ${relative}`);
      }
    }
  }
});

test("non-rule project packages preserve the content contract and enter only their own routes", () => {
  const packages = [
    {
      project: pcconfigProject,
      modules: pcconfigModules,
      expectedSlug: "pcconfig",
      expectedOrder: 2,
      expectedModules: ["machine-facts", "runtime-startup", "recovery-backup", "secrets-providers", "protected-actions", "protected-data"]
    },
    {
      project: githubIndexProject,
      modules: githubIndexModules,
      expectedSlug: "github-index",
      expectedOrder: 3,
      expectedModules: ["repository-ledger", "project-admission", "worktree-sync", "publication-gate", "protected-major-actions", "snapshot-recovery"]
    },
    {
      project: chineseAsrProject,
      modules: chineseAsrModules,
      expectedSlug: "chinese-asr",
      expectedOrder: 4,
      expectedModules: ["task-routing", "models-modes", "long-batch", "audit-evidence", "speaker-attribution", "runtime-privacy"]
    }
  ];
  for (const entry of packages) {
    const { project: candidate, modules: candidateModules } = entry;
    assert.equal(candidate.slug, entry.expectedSlug);
    assert.equal(candidate.order, entry.expectedOrder);
    assert.ok(["pass", "problem", "unknown", "mixed"].includes(candidate.statusTone), `${candidate.slug}.statusTone is invalid`);
    for (const key of ["summary", "why", "plainExample", "result"]) {
      assert.equal(typeof candidate[key], "string", `${candidate.slug}.${key} is missing`);
      assert.notEqual(candidate[key].trim(), "", `${candidate.slug}.${key} is empty`);
    }
    assertReaderStates(candidate.readerStates, `${candidate.slug} overview`);
    assert.ok(candidateModules.length >= 1, `${candidate.slug} has no modules`);
    assert.deepEqual(candidateModules.map((item) => item.slug), entry.expectedModules, `${candidate.slug} module contract drifted`);
    assert.equal(new Set(candidateModules.map((item) => item.slug)).size, candidateModules.length, `${candidate.slug} module slugs are not unique`);
    for (const module of candidateModules) {
      assert.ok(["pass", "problem", "unknown", "mixed"].includes(module.statusTone), `${candidate.slug}/${module.slug}.statusTone is invalid`);
      for (const key of ["value", "why", "example", "result", "problem", "status"]) {
        assert.equal(typeof module[key], "string", `${candidate.slug}/${module.slug}.${key} is missing`);
        assert.notEqual(module[key].trim(), "", `${candidate.slug}/${module.slug}.${key} is empty`);
      }
      assertReaderStates(module.readerStates, `${candidate.slug}/${module.slug}`);
      for (const key of ["decisionImpact", "implementation", "flow", "concepts", "boundaries", "failures", "sources", "verification"]) {
        assert.ok(Array.isArray(module[key]) && module[key].length >= 1, `${candidate.slug}/${module.slug}.${key} is incomplete`);
      }
    }
    assert.ok(routePaths.includes(candidate.route), `${candidate.slug} overview route is missing`);
    for (const module of candidateModules) assert.ok(routePaths.includes(`${candidate.route}/${module.slug}`), `${candidate.slug}/${module.slug} route is missing`);
  }
});

test("project evolution records important dated stages instead of append-only update logs", () => {
  for (const entry of projectCatalog) {
    const dates = entry.project.evolution.map((item) => item.date);
    assert.equal(new Set(dates).size, dates.length, `${entry.project.slug} repeats an evolution period`);
    for (const item of entry.project.evolution) {
      assert.match(item.date, /^\d{4}-\d{2}-\d{2}(?:[—–](?:\d{4}-)?\d{2}-\d{2})?$/, `${entry.project.slug} evolution must use a date or date range`);
      assert.equal(typeof item.result, "string", `${entry.project.slug} evolution result is missing`);
      assert.notEqual(item.result.trim(), "", `${entry.project.slug} evolution result is empty`);
    }
  }
});

test("impact assessment creates tasks only for confirmed material changes", () => {
  const script = path.join(projectRoot, "scripts", "assess-panel-impact.mjs");
  const run = (args) => JSON.parse(execFileSync(process.execPath, [script, ...args], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
  const candidateOnly = run(["--project", "agents", "--path", "AGENTS.md"]);
  const material = run(["--project", "agents", "--path", "plugins/md-pdf-toolkit/skills/md-to-pdf/SKILL.md", "--material-change"]);
  const unrelated = run(["--project", "agents", "--path", "docs/unrelated.md"]);
  const generationCandidate = run(["--project", "agents", "--generation-changed"]);
  const generationMaterial = run(["--project", "agents", "--generation-changed", "--material-change"]);
  const pcconfigCandidate = run(["--project", "pcconfig", "--path", "registries/tasks.json"]);
  const pcconfigMaterial = run(["--project", "pcconfig", "--path", "registries/tasks.json", "--material-change"]);
  const githubMaterial = run(["--project", "github-index", "--path", "docs/contracts/git.protected-major-actions.md", "--material-change"]);
  const asrCandidate = run(["--project", "chinese-asr", "--path", "src/zh_asr/pipeline.py"]);
  const asrMaterial = run(["--project", "chinese-asr", "--path", "src/zh_asr/pipeline.py", "--material-change"]);
  assert.equal(candidateOnly.impact_candidate, true);
  assert.equal(candidateOnly.task_required, false);
  assert.equal(material.task_required, true);
  assert.equal(material.action, "create_fresh_independent_website_project_task_after_source_readback");
  assert.equal(unrelated.impact_candidate, false);
  assert.equal(unrelated.task_required, false);
  assert.equal(generationCandidate.impact_candidate, true);
  assert.equal(generationCandidate.task_required, false);
  assert.equal(generationMaterial.task_required, true);
  assert.equal(pcconfigCandidate.impact_candidate, true);
  assert.equal(pcconfigCandidate.task_required, false);
  assert.equal(pcconfigMaterial.task_required, true);
  assert.equal(githubMaterial.task_required, true);
  assert.equal(asrCandidate.impact_candidate, true);
  assert.equal(asrCandidate.task_required, false);
  assert.equal(asrMaterial.task_required, true);
});

test("AI refresh planner supports targeted and full refresh without writing narrative content", async () => {
  const script = path.join(projectRoot, "scripts", "prepare-ai-panel-refresh.mjs");
  const contentPaths = ["app/content-core.js", "app/content-pcconfig.js", "app/content-github-index.js", "app/content-chinese-asr.js"];
  const before = await Promise.all(contentPaths.map((item) => readFile(path.join(projectRoot, item), "utf8")));
  const run = (args) => JSON.parse(execFileSync(process.execPath, [script, ...args], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
  const targeted = run(["--project", "pcconfig"]);
  const full = run(["--all"]);
  const after = await Promise.all(contentPaths.map((item) => readFile(path.join(projectRoot, item), "utf8")));

  assert.equal(targeted.schema, "wly.ai-panel-refresh-plan.v1");
  assert.equal(targeted.status, "ready_for_ai");
  assert.equal(targeted.mode, "targeted");
  assert.deepEqual(targeted.selected_projects.map((item) => item.id), ["pcconfig"]);
  assert.match(targeted.selected_projects[0].content_sha256, /^[a-f0-9]{64}$/);
  assert.equal(targeted.selected_projects[0].semantic_revision, 2);
  assert.equal(targeted.selected_projects[0].source_fingerprint, null);
  assert.match(targeted.selected_projects[0].source_fingerprint_state, /fresh Owner evidence/);
  assert.equal(full.mode, "all");
  assert.deepEqual(full.selected_projects.map((item) => item.id), ["agents", "pcconfig", "github-index", "chinese-asr"]);
  assert.match(full.materiality.default, /no website change/i);
  assert.match(full.anti_bloat.content_update, /never append refresh logs/i);
  assert.match(full.boundaries.rule_refresh, /verified current E release/i);
  assert.deepEqual(after, before, "refresh planning changed narrative content");
  const missing = spawnSync(process.execPath, [script, "--project", "missing"], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /Unknown or disabled panel project/);

  const contract = await readFile(path.join(projectRoot, "docs", "maintenance", "ai-panel-refresh.md"), "utf8");
  assert.match(contract, /网页内容只由网站项目里的 AI 任务更新/);
  assert.match(contract, /全量刷新是全量复核，不是全量重写/);
  assert.match(contract, /一个阶段可以是一天或时间段/);

  const tempRoot = await mkdtemp(path.join(tmpdir(), "wly-ai-refresh-test-"));
  try {
    const bundlePath = path.join(tempRoot, "bundle.json");
    const bundle = {
      schema: "wly.ai-panel-refresh-result.v1",
      mode: "all",
      projects: full.selected_projects.map((item) => ({
        id: item.id,
        status: "unchanged",
        content_path: item.content_path,
        old_content_sha256: item.content_sha256,
        new_content_sha256: item.content_sha256,
        old_semantic_revision: item.semantic_revision,
        new_semantic_revision: item.semantic_revision,
        source_fingerprint: createHash("sha256").update(`test-source:${item.id}`).digest("hex"),
        material: false,
        semantic_change: false,
        reason: "fresh evidence did not change a material user judgment",
        observed_at: "2026-08-29T00:00:00Z",
        collectors: item.collectors.map((command) => ({ command, status: "pass", duration_seconds: 0.1 }))
      })),
      auto_repairs: [],
      blockers: []
    };
    await writeFile(bundlePath, JSON.stringify(bundle, null, 2), "utf8");
    const verification = JSON.parse(execFileSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
    assert.equal(verification.status, "pass");
    assert.deepEqual(verification.counts, { changed: 0, unchanged: 4, blocked: 0 });
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("the .agents project has six complete modules plus Overview", () => {
  assert.deepEqual(modules.map((item) => item.slug), [
    "rules-contracts",
    "capability-routing",
    "authorization-owner",
    "protected-policy",
    "skills-plugins",
    "context-evidence"
  ]);
  for (const module of modules) {
    assert.ok(["pass", "problem", "unknown", "mixed"].includes(module.statusTone), `${module.slug}.statusTone is invalid`);
    assert.ok(module.problem.length > 60, `${module.slug} problem is too short`);
    assert.ok(module.value.length > 40, `${module.slug} lacks plain-language value`);
    for (const key of ["why", "example", "result"]) {
      assert.ok(module[key]?.length >= 45, `${module.slug} lacks plain-language ${key}`);
    }
    assertReaderStates(module.readerStates, module.slug);
    assert.ok(module.decisionImpact.length >= 4, `${module.slug} lacks decision impact`);
    assert.ok(module.implementation.length >= 4, `${module.slug} implementation is incomplete`);
    assert.ok(module.flow.length >= 5, `${module.slug} flow is incomplete`);
    assert.ok(module.concepts.length >= 3, `${module.slug} concepts are incomplete`);
    assert.ok(module.boundaries.length >= 3, `${module.slug} boundaries are incomplete`);
    assert.ok(module.failures.length >= 3, `${module.slug} failures are incomplete`);
    assert.ok(module.sources.length >= 3, `${module.slug} sources are incomplete`);
    assert.ok(module.verification.length >= 3, `${module.slug} verification is incomplete`);
  }
  assert.ok(project.components.length >= 10);
  for (const key of ["why", "plainExample", "result"]) {
    assert.ok(project[key]?.length >= 80, `project overview lacks plain-language ${key}`);
  }
  assertReaderStates(project.readerStates, "project overview");
  assert.ok(project.glossary.length >= 25);
  assert.ok(project.usageExamples.length >= 5);
  assert.ok(project.evidenceLayers.length >= 6);
  assert.ok(project.operationalEntrypoints.length >= 5);
  assert.ok(project.evolution.length >= 10);
  assert.equal(new Set(project.evolution.map((item) => item.date)).size, project.evolution.length, "evolution timeline must group same-day implementation commits into one milestone");
});

test("the rules workbench exposes exactly five verified current E-release rules", () => {
  assert.match(rulesSnapshot.releaseId, /^E\d+$/);
  assert.equal(rulesSnapshot.generation, rulesSnapshot.releaseId);
  assert.equal(rulesSnapshot.status, "e_rules_active_verified");
  assert.equal(rulesSnapshot.requiredRulesVerified, true);
  assert.equal(rulesSnapshot.activationVerified, true);
  assert.equal(rulesSnapshot.legacyCState, "retired_recovery_only");
  assert.match(rulesSnapshot.gitCommit, /^[a-f0-9]{40}$/);
  assert.match(rulesSnapshot.rulesetSha256, /^[a-f0-9]{64}$/);
  assert.match(rulesSnapshot.previous.release_id, /^E\d+$/);
  assert.equal(rulesSnapshot.rules.length, 5);
  assert.deepEqual(rulesSnapshot.rules.map((rule) => rule.logicalId), [
    "agents_root_rules",
    "protected_major_actions_contract",
    "authorization_delegation_contract",
    "four_base_decision_context_contract",
    "capability_routing_contract"
  ]);
  for (const rule of rulesSnapshot.rules) {
    assert.match(rule.sha256, /^[a-f0-9]{64}$/);
    assert.ok(rule.releaseRelativePath?.length > 1);
    assert.ok(rule.plainLanguage.length > 40);
    for (const key of ["why", "example", "result"]) {
      assert.ok(rule[key]?.length >= 45, `${rule.logicalId} lacks plain-language ${key}`);
    }
    assertReaderStates(rule.readerStates, rule.logicalId);
    assert.ok(rule.decisions.length >= 4);
    assert.ok(rule.allowed.length >= 3);
    assert.ok(rule.forbidden.length >= 3);
    assert.ok(rule.process.length >= 5);
    assert.ok(rule.failure.length >= 3);
    assert.ok(rule.sections.length >= 3);
    const guide = ruleGuides[rule.logicalId];
    assert.ok(guide.glossary.length >= 4, `${rule.logicalId} glossary is incomplete`);
    assert.ok(guide.sections.length >= 2, `${rule.logicalId} full guide is incomplete`);
    assert.ok(guide.sections.reduce((count, section) => count + section.items.length, 0) >= 15, `${rule.logicalId} full semantic list is incomplete`);
  }
});

test("the Skills catalog contains the selected usable capabilities in value order", () => {
  assert.equal(skills.length, 22);
  assert.deepEqual(skills.map((item) => item.slug), [
    "personal-media",
    "personal-materials",
    "wechat-direct",
    "google-workspace-direct",
    "chinese-asr",
    "localocr",
    "personal-health",
    "md-to-pdf",
    "pdf-render-safe",
    "mojibake-doctor",
    "file-intake-router",
    "media-person-self",
    "local-secret-broker",
    "authorization-file-broker",
    "vault-workflow",
    "project-entry-gate",
    "personal-panel-refresh",
    "control-plane-doctor",
    "tailscale-safe-exposure",
    "llm-backend-toolkit",
    "native-economy-routing",
    "token-budget-advisor"
  ]);
  for (const item of skills) {
    for (const key of ["name", "title", "status", "summary", "maturity", "sourcePath"]) {
      assert.ok(item[key]?.length >= 1, `${item.slug}.${key} is missing`);
    }
    assert.ok(["pass", "mixed", "unknown", "problem"].includes(item.statusTone), `${item.slug}.statusTone is invalid`);
    assert.ok(item.transactionState.length >= 10, `${item.slug}.transactionState is incomplete`);
    assert.match(item.evidenceSourceCommit, /^[a-f0-9]{40}$/);
    assert.match(item.supplyEvidenceCommand, /Test-PersonalSkillSupply\.ps1/);
    for (const key of ["useWhen", "avoidWhen", "inputs", "outputs", "flow", "boundaries", "dependencies"]) {
      assert.ok(item[key].length >= 1, `${item.slug}.${key} is incomplete`);
    }
    assert.ok(item.tests.length > 20, `${item.slug}.tests is incomplete`);
    assert.ok(skillOutcomes[item.slug]?.value.length >= 40, `${item.slug} lacks a plain-language value statement`);
    for (const key of ["why", "example", "result"]) {
      assert.ok(skillOutcomes[item.slug]?.[key]?.length >= 35, `${item.slug} lacks plain-language ${key}`);
    }
    assertReaderStates(skillOutcomes[item.slug]?.readerStates, item.slug);
    assert.ok(skillOutcomes[item.slug]?.changes.length >= 3, `${item.slug} lacks decision impact`);
    assert.ok(skillGuides[item.slug]?.glossary.length >= 3, `${item.slug} lacks term translations`);
    assert.ok(skillGuides[item.slug]?.failures.length >= 2, `${item.slug} lacks failure and recovery rules`);
  }
  assert.equal(excludedSkills.length, 0);
});

test("global search handles natural rewrites, mixed Latin terms and bounded broad results", () => {
  assert.equal(searchPanel("哪个 Skill 可以找照片")[0]?.title, "personal-media");
  assert.equal(searchPanel("fresh task 为什么受阻")[0]?.title, "personal-panel-refresh");
  assert.equal(searchPanel("改了项目怎么没有自动刷新面板")[0]?.title, "personal-panel-refresh");
  assert.equal(searchPanel("C盘规则为什么不能阻塞spawn")[0]?.title, "重大动作保护");
  assert.equal(searchPanel("dirty source 不能冒充 current release")[0]?.title, "重大动作保护");
  assert.equal(searchPanel("同一个目标不要反复问我授权")[0]?.title, "授权与委派");
  assert.equal(searchPanel("本地构建通过为什么还不能说网站完成")[0]?.title, "三控制面上下文、耐久状态与完成证据");
  assert.equal(searchPanel("怎么避免全局规则覆盖项目自己的验收方式")[0]?.title, "全局根规则");
  assert.equal(searchPanel("PCConfig")[0]?.title, "PCConfig · 总览");
  assert.equal(searchPanel("GitHub 总索引")[0]?.title, "GitHub 总索引 · 总览");
  assert.equal(searchPanel("ChineseASR")[0]?.title, "ChineseASR · 总览");
  assert.equal(searchPanel("长音频断点续跑")[0]?.title, "连续时间线、长音频断点续跑与文件夹批量");
  assert.ok(searchPanel("的").length > 9, "broad search should retain the true total before UI truncation");
});

test("dynamic snapshot facts are separated from partial validation", () => {
  assert.equal(panelSnapshot.schema, "wly.panel-facts.v2");
  assert.equal(panelSnapshot.authority.status, "e_rules_active_verified");
  assert.match(panelSnapshot.authority.releaseId, /^E\d+$/);
  assert.equal(panelSnapshot.authority.legacyCState, "retired_recovery_only");
  assert.ok(panelSnapshot.validation.rows.some((row) => row.status === "pass"));
  assert.ok(panelSnapshot.validation.rows.length >= 5);
  assert.ok(Array.isArray(panelSnapshot.validation.failures));
  for (const row of panelSnapshot.validation.rows) {
    assert.ok(["pass", "repair", "unknown"].includes(row.status));
    assert.ok(row.detail.length > 20);
  }
  if (panelSnapshot.validation.rows.find((row) => row.layer.startsWith("E release validator"))?.status === "repair") {
    assert.ok(panelSnapshot.validation.failures.length >= 1, "failed release validation must name the failing checks");
  }
  assert.match(panelSnapshot.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(typeof panelSnapshot.sourceWorktreeClean, "boolean");
  assert.ok(Number.isInteger(panelSnapshot.sourceDirtyCount));
  assert.equal(panelSnapshot.sourceDirtyCount, panelSnapshot.sourceDirtyPaths.length);
  assert.equal(panelSnapshot.skills.selectedPublicCount, skills.length);
  assert.ok(panelSnapshot.skills.activeInstallIntent >= panelSnapshot.skills.selectedPublicCount);
  assert.equal(panelSnapshot.ruleBinding.length, 5);
  for (const binding of panelSnapshot.ruleBinding) {
    assert.match(binding.sourceSha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(binding.sourceBytes));
    assert.equal(typeof binding.sourceMatchesRelease, "boolean");
    assert.ok(binding.releasePath.includes(`E:\\.agents\\releases\\${panelSnapshot.authority.releaseId}\\`));
  }
});

test("publication cannot upload before snapshot binding, production build, public gate and route tests", async () => {
  const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
  const workflow = await readFile(path.join(projectRoot, ".github", "workflows", "pages.yml"), "utf8");
  const verifier = await readFile(path.join(projectRoot, "scripts", "verify-public-content.mjs"), "utf8");
  const refresher = await readFile(path.join(projectRoot, "scripts", "refresh-panel-snapshot.mjs"), "utf8");
  const snapshotVerifier = await readFile(path.join(projectRoot, "scripts", "verify-panel-snapshot.mjs"), "utf8");
  assert.match(packageJson.scripts.build, /build:site/);
  assert.match(packageJson.scripts.build, /verify:snapshot/);
  assert.match(packageJson.scripts.build, /verify:public/);
  assert.ok(workflow.indexOf("run: npm run build") < workflow.indexOf("run: npm test"));
  assert.ok(workflow.indexOf("run: npm test") < workflow.indexOf("actions\/upload-pages-artifact"));
  assert.ok(workflow.indexOf("run: npm run build") < workflow.indexOf("actions\/upload-pages-artifact"));
  assert.match(verifier, /production_artifact_missing/);
  assert.match(verifier, /production_html_missing/);
  assert.match(verifier, /production_javascript_missing/);
  assert.match(verifier, /GitHub fine-grained token/);
  assert.doesNotMatch(verifier, /textExtensions/);
  assert.match(verifier, /core\.quotepath=false/);
  assert.match(verifier, /"-z"/);
  assert.match(verifier, /split\("\\0"\)/);
  assert.match(refresher, /const sourceRoot = "E:\\\\.agents"/);
  assert.match(refresher, /Invoke-EAgentRulesRelease\.ps1/);
  assert.match(refresher, /e_rules_active_verified/);
  assert.doesNotMatch(refresher, /Get-ProtectedPolicyAuthorityStatus|policy_epoch|production_activation|candidate_pending/);
  assert.match(snapshotVerifier, /Invoke-EAgentRulesRelease\.ps1/);
  assert.match(snapshotVerifier, /snapshot_live_release_id_drift/);
  assert.match(snapshotVerifier, /snapshot_live_rule_descriptor_drift/);
  assert.doesNotMatch(refresher, /--source-root|--skip-tests|--offline/);
});

test("public content excludes forbidden projects and obvious credential values", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const contentCore = await readFile(path.join(projectRoot, "app", "content-core.js"), "utf8");
  const contentSkills = await readFile(path.join(projectRoot, "app", "content-skills.js"), "utf8");
  const contentRuleGuides = await readFile(path.join(projectRoot, "app", "content-rule-guides.js"), "utf8");
  const contentPcconfig = await readFile(path.join(projectRoot, "app", "content-pcconfig.js"), "utf8");
  const contentGithubIndex = await readFile(path.join(projectRoot, "app", "content-github-index.js"), "utf8");
  const contentChineseAsr = await readFile(path.join(projectRoot, "app", "content-chinese-asr.js"), "utf8");
  const siteContent = await readFile(path.join(projectRoot, "app", "site-content.js"), "utf8");
  const searchSource = await readFile(path.join(projectRoot, "app", "search.js"), "utf8");
  const publicText = `${pageSource}\n${contentCore}\n${contentSkills}\n${contentRuleGuides}\n${contentPcconfig}\n${contentGithubIndex}\n${contentChineseAsr}\n${siteContent}\n${searchSource}`;
  assertForbiddenTermsAreAbsent(publicText);
  assert.doesNotMatch(publicText, /sk-[A-Za-z0-9_-]{20,}/);
  assert.doesNotMatch(publicText, /gh[pousr]_[A-Za-z0-9]{20,}/);
  assert.doesNotMatch(publicText, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
  assert.doesNotMatch(publicText, /AIza[0-9A-Za-z_-]{30,}/);
  assert.match(pageSource, /搜索项目、规则或 Skill/);
  assert.doesNotMatch(pageSource, /addEventListener\("scroll"/);
});

test("every public route is unique and has useful metadata", () => {
  assert.equal(new Set(routePaths).size, routePaths.length);
  assert.equal(routePaths.length, 53);
  assert.equal(routePaths.length, 3 + skills.length + projectCatalog.reduce((count, entry) => count + 1 + entry.modules.length, 0));
  for (const route of routePaths) {
    const meta = routeMeta(route);
    assert.match(meta.title, /吴乐阳/);
    assert.ok(meta.description.length >= 20, `${route} description is too short`);
    assert.ok(meta.description.length <= 220, `${route} description is too long`);
  }
  assert.ok(!routePaths.includes("/skills/nope/personal-media"));
  assert.match(routeMeta("/skills/nope/personal-media").title, /页面不存在/);
  assert.match(routeMeta("/projects/pcconfig/nope/machine-facts").title, /页面不存在/);
});

test("production build has direct entry files for every route", async () => {
  const distRoot = path.join(projectRoot, "dist");
  await access(path.join(distRoot, "index.html"));
  for (const route of routePaths) {
    const routeIndex = route === "/"
      ? path.join(distRoot, "index.html")
      : path.join(distRoot, ...route.slice(1).split("/"), "index.html");
    const html = await readFile(routeIndex, "utf8");
    assert.match(html, /<div id="root"><\/div>/);
    assert.ok(html.includes(`<link rel="canonical" href="${canonicalUrl(route)}" />`), `${route} canonical drifted`);
    assert.doesNotMatch(html, /\.\.\/assets\//);
  }
});

test("SEO, sitemap, robots and custom 404 match the current route set", async () => {
  const distRoot = path.join(projectRoot, "dist");
  const escapeAttribute = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  for (const route of routePaths) {
    const meta = routeMeta(route);
    const routeIndex = route === "/" ? path.join(distRoot, "index.html") : path.join(distRoot, ...route.slice(1).split("/"), "index.html");
    const html = await readFile(routeIndex, "utf8");
    assert.ok(html.includes(`<title>${escapeAttribute(meta.title)}</title>`), `${route} title drifted`);
    assert.ok(html.includes(`<meta name="description" content="${escapeAttribute(meta.description)}" />`), `${route} description drifted`);
    assert.ok(html.includes(`<link rel="canonical" href="${canonicalUrl(route)}" />`), `${route} canonical drifted`);
    assert.ok(html.includes(`<meta property="og:url" content="${canonicalUrl(route)}" />`), `${route} Open Graph URL drifted`);
    assert.ok(html.includes(`<meta property="og:title" content="${escapeAttribute(meta.title)}" />`), `${route} Open Graph title drifted`);
    assert.ok(html.includes(`<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`), `${route} Twitter title drifted`);
  }
  const sitemap = await readFile(path.join(distRoot, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<url>/g) || []).length, routePaths.length);
  for (const route of routePaths) assert.ok(sitemap.includes(`<loc>${canonicalUrl(route)}</loc>`));
  const robots = await readFile(path.join(projectRoot, "public", "robots.txt"), "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Sitemap: https:\/\/wly0829\.cn\/sitemap\.xml/);
  const notFound = await readFile(path.join(projectRoot, "public", "404.html"), "utf8");
  assert.match(notFound, /<meta name="robots" content="noindex, follow"/);
  assert.doesNotMatch(notFound, /<footer|WLY0829\.CN/);
});

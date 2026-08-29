import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ruleGuides } from "../app/content-rule-guides.js";
import { skillGuides, skillOutcomes } from "../app/content-skill-guides.js";
import { searchPanel } from "../app/search.js";
import {
  canonicalUrl,
  excludedSkills,
  modules,
  panelSnapshot,
  primaryNav,
  project,
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

test("the MVP has one project and exactly three navigation areas", () => {
  assert.equal(project.order, 1);
  assert.equal(project.slug, "agents");
  assert.deepEqual(primaryNav.map((item) => item.label), ["项目", "规则", "Skills"]);
  assert.ok(!routePaths.includes("/ideas"));
  assert.ok(!routePaths.some((route) => route.startsWith("/ideas/")));
});

test("the maintenance registry is extensible and currently starts with .agents", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.schema, "wly.personal-panel-project-registry.v1");
  assert.equal(registry.refresh_policy.mode, "event_driven_fresh_project_task");
  assert.equal(registry.refresh_policy.trigger, "displayed_fact_or_explanation_changed");
  assert.equal(registry.refresh_policy.only_private_document, "docs/design/private-content-rules.md");
  assert.equal(registry.refresh_policy.default_presentation_mode, "real_dashboard");
  assert.equal(registry.projects.length, 1);
  assert.equal(registry.projects[0].id, "agents");
  assert.equal(registry.projects[0].order, 1);
  assert.equal(registry.projects[0].route, "/projects/agents");
  assert.equal(registry.projects[0].enabled, true);
  assert.equal(registry.projects[0].presentation_mode, "real_dashboard");
  assert.ok(registry.projects[0].impact_sources.length >= 5);
  assert.ok(!registry.projects.some((item) => item.id === "website"));
});

test("impact assessment creates tasks only for confirmed material changes", () => {
  const script = path.join(projectRoot, "scripts", "assess-panel-impact.mjs");
  const run = (args) => JSON.parse(execFileSync(process.execPath, [script, ...args], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
  const candidateOnly = run(["--project", "agents", "--path", "AGENTS.md"]);
  const material = run(["--project", "agents", "--path", "plugins/md-pdf-toolkit/skills/md-to-pdf/SKILL.md", "--material-change"]);
  const unrelated = run(["--project", "agents", "--path", "docs/unrelated.md"]);
  const generationCandidate = run(["--project", "agents", "--generation-changed"]);
  const generationMaterial = run(["--project", "agents", "--generation-changed", "--material-change"]);
  assert.equal(candidateOnly.impact_candidate, true);
  assert.equal(candidateOnly.task_required, false);
  assert.equal(material.task_required, true);
  assert.equal(material.action, "create_fresh_independent_website_project_task_after_source_readback");
  assert.equal(unrelated.impact_candidate, false);
  assert.equal(unrelated.task_required, false);
  assert.equal(generationCandidate.impact_candidate, true);
  assert.equal(generationCandidate.task_required, false);
  assert.equal(generationMaterial.task_required, true);
});

test("the .agents project has six complete reconstructable modules", () => {
  assert.deepEqual(modules.map((item) => item.slug), [
    "rules-contracts",
    "capability-routing",
    "authorization-owner",
    "protected-policy",
    "skills-plugins",
    "context-evidence"
  ]);
  for (const module of modules) {
    assert.ok(module.problem.length > 60, `${module.slug} problem is too short`);
    assert.ok(module.value.length > 40, `${module.slug} lacks plain-language value`);
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
  assert.ok(project.glossary.length >= 25);
  assert.ok(project.usageExamples.length >= 5);
  assert.ok(project.evidenceLayers.length >= 6);
  assert.ok(project.operationalEntrypoints.length >= 5);
  assert.ok(project.evolution.length >= 10);
});

test("the rules workbench exposes exactly five verified generation-79 rules", () => {
  assert.equal(rulesSnapshot.generation, 79);
  assert.ok(["active_verified", "candidate_pending", "candidate_unavailable"].includes(rulesSnapshot.status));
  assert.equal(rulesSnapshot.requiredRulesVerified, true);
  assert.equal(rulesSnapshot.productionActivation, true);
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
    assert.ok(rule.plainLanguage.length > 40);
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
    for (const key of ["useWhen", "avoidWhen", "inputs", "outputs", "flow", "boundaries", "dependencies"]) {
      assert.ok(item[key].length >= 1, `${item.slug}.${key} is incomplete`);
    }
    assert.ok(item.tests.length > 20, `${item.slug}.tests is incomplete`);
    assert.ok(skillOutcomes[item.slug]?.value.length >= 40, `${item.slug} lacks a plain-language value statement`);
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
  assert.equal(searchPanel("候选规则是不是已经生效了")[0]?.title, "重大动作保护");
  assert.equal(searchPanel("candidate 不能冒充 active")[0]?.title, "重大动作保护");
  assert.equal(searchPanel("同一个目标不要反复问我授权")[0]?.title, "授权与委派");
  assert.ok(searchPanel("的").length > 9, "broad search should retain the true total before UI truncation");
});

test("dynamic snapshot facts are separated from partial validation", () => {
  assert.equal(panelSnapshot.authority.integrityIncident, false);
  assert.ok(panelSnapshot.validation.rows.some((row) => row.status === "pass"));
  assert.equal(panelSnapshot.validation.rows.length, 5);
  assert.ok(Array.isArray(panelSnapshot.validation.failures));
  for (const row of panelSnapshot.validation.rows) {
    assert.ok(["pass", "repair", "unknown"].includes(row.status));
    assert.ok(row.detail.length > 20);
  }
  if (panelSnapshot.validation.rows.some((row) => row.status !== "pass")) {
    assert.ok(panelSnapshot.validation.failures.length >= 1, "failed validation must name the failing checks");
  }
  assert.match(panelSnapshot.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(panelSnapshot.skills.selectedPublicCount, skills.length);
  assert.ok(panelSnapshot.skills.activeInstallIntent >= panelSnapshot.skills.selectedPublicCount);
  assert.equal(panelSnapshot.ruleBinding.length, 5);
  for (const binding of panelSnapshot.ruleBinding) {
    assert.match(binding.candidateSha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(binding.candidateBytes));
    assert.equal(typeof binding.candidateMatchesActive, "boolean");
  }
});

test("publication cannot upload before snapshot binding, production build, public gate and route tests", async () => {
  const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
  const workflow = await readFile(path.join(projectRoot, ".github", "workflows", "pages.yml"), "utf8");
  const verifier = await readFile(path.join(projectRoot, "scripts", "verify-public-content.mjs"), "utf8");
  const refresher = await readFile(path.join(projectRoot, "scripts", "refresh-panel-snapshot.mjs"), "utf8");
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
  assert.match(refresher, /const sourceRoot = "E:\\\\.agents"/);
  assert.doesNotMatch(refresher, /--source-root|--skip-tests|--offline/);
});

test("public content excludes forbidden projects and obvious credential values", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const contentCore = await readFile(path.join(projectRoot, "app", "content-core.js"), "utf8");
  const contentSkills = await readFile(path.join(projectRoot, "app", "content-skills.js"), "utf8");
  const contentRuleGuides = await readFile(path.join(projectRoot, "app", "content-rule-guides.js"), "utf8");
  const publicText = `${pageSource}\n${contentCore}\n${contentSkills}\n${contentRuleGuides}`;
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
  assert.equal(routePaths.length, 32);
  for (const route of routePaths) {
    const meta = routeMeta(route);
    assert.match(meta.title, /吴乐阳/);
    assert.ok(meta.description.length >= 20, `${route} description is too short`);
    assert.ok(meta.description.length <= 220, `${route} description is too long`);
  }
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

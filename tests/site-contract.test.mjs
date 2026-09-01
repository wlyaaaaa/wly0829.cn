import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ruleGuides } from "../app/content-rule-guides.js";
import { chineseAsrModules, chineseAsrProject } from "../app/content-chinese-asr.js";
import { githubIndexModules, githubIndexProject } from "../app/content-github-index.js";
import { pcconfigModules, pcconfigProject } from "../app/content-pcconfig.js";
import { pcPanelHubModules, pcPanelHubProject } from "../app/content-pc-panel-hub.js";
import { cacbModules, cacbProject } from "../app/content-cacb.js";
import { codexRemoteModules, codexRemoteProject } from "../app/content-codex-remote.js";
import { learningModules, learningProject } from "../app/content-learning.js";
import { personalHealthModules, personalHealthProject } from "../app/content-personal-health.js";
import { timeAuditModules, timeAuditProject } from "../app/content-timeaudit.js";
import { skillGuides, skillOutcomes } from "../app/content-skill-guides.js";
import { projectReferenceLinks, skillProjectLinks } from "../app/content-capability-links.js";
import { globalSearchEntries, searchPanel, searchScopeForPath } from "../app/search.js";
import { createTermAnnotator } from "../app/term-annotator.js";
import { searchCompactEntries } from "../app/compact-search.js";
import {
  systemDependencyNodes,
  systemDirectoryIntroductions,
  systemEvidenceLayers,
  systemHomeHero,
  systemProjectDomains,
  systemProjectInventory,
  systemProjectSourceMap,
  systemRuleStories,
  systemSkillFamilies,
  systemScenarios
} from "../app/system-home-content.js";
import {
  canonicalPath,
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
  site,
  skills,
  socialLinks
} from "../app/site-content.js";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");
const expectedCanonicalUrl = (route) => canonicalUrl(route === "/system" ? "/" : route);

const credentialValuePatterns = [
  ["OpenAI-style key", /sk-[A-Za-z0-9_-]{20,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{20,}/],
  ["GitHub fine-grained token", /github_pat_[A-Za-z0-9_]{20,}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{30,}/],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["assigned credential", /(?:password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{8,}/i]
];
const publicSafeProductAndDomainLabels = ["CodexHarness", "PersonalOS", "PersonalKnowledgeBase", "AI 大模型", "AI 教练"];

function assertNoCredentialValues(text) {
  for (const [name, pattern] of credentialValuePatterns) {
    assert.doesNotMatch(text, pattern, `public content contains ${name}`);
  }
}
// Preserve the published TimeAudit assertion call while removing all label-based bans.
const assertForbiddenTermsAreAbsent = assertNoCredentialValues;

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

test("the accepted panel has exactly ten projects and four navigation areas", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.deepEqual(projects.map((item) => item.slug), ["agents", "pcconfig", "github-index", "chinese-asr", "timeaudit", "pc-panel-hub", "cacb", "learning", "codex-remote", "personal-health"]);
  assert.deepEqual(projects.map((item) => item.order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(project.slug, "agents");
  assert.deepEqual(primaryNav.map((item) => item.label), ["系统", "项目", "规则", "Skills"]);
  assert.equal(primaryNav[0].href, "/");
  assert.equal(primaryNav[1].href, "/projects");
  assert.ok(routePaths.includes("/projects"));
  assert.ok(routePaths.includes("/system"));
  assert.ok(routePaths.includes("/search"));
  assert.ok(!routePaths.includes("/ideas"));
  assert.match(pageSource, /共 \{projectCatalog\.length\} 个项目/);
  assert.ok(!routePaths.some((route) => route.startsWith("/ideas/")));
  assert.doesNotMatch(styleSource, /project-card-shell:nth-child\(odd\):last-child/, "an odd final project must stay in normal grid order instead of jumping to a centered special case");
});

test("the mobile header keeps primary navigation outside and uses a dedicated search icon", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  const runtimeSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  const primaryNavigationIndex = pageSource.indexOf('<nav className="primary-nav"');
  const menuIndex = pageSource.indexOf('<div className={`header-navigation');
  assert.ok(primaryNavigationIndex >= 0 && menuIndex > primaryNavigationIndex, "primary navigation must stay outside the mobile menu");
  assert.match(pageSource, /GlobalSearch path=\{path\} search=\{search\} className="desktop-search"/);
  assert.match(pageSource, /className="brand" href="https:\/\/github\.com\/wlyaaaaa" target="_blank"/);
  assert.match(pageSource, /className="brand-logo" src="\/media\/brand\/wuleyang-logo-full\.png" width="1687" height="327"/);
  assert.match(pageSource, /className="brand-text">吴乐阳<\/span>/);
  assert.match(styleSource, /\.brand-logo\s*\{[^}]*width:\s*clamp\(190px, 15vw, 260px\);[^}]*height:\s*auto;/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.brand-logo\s*\{\s*display:\s*none;[\s\S]*?\.brand-text\s*\{\s*display:\s*inline;/);
  const brandAssetPath = path.join(projectRoot, "public", "media", "brand", "wuleyang-logo-full.png");
  assert.ok((await stat(brandAssetPath)).size > 100_000, "Full transparent wordmark asset is missing or unexpectedly truncated");
  assert.equal((await readFile(brandAssetPath))[25], 6, "Wordmark PNG must retain an RGBA alpha channel");
  assert.match(pageSource, /className="mobile-search-button"/);
  assert.match(pageSource, /className=\{`mobile-search-panel\$\{searchOpen \? " is-open" : ""\}`\}[\s\S]*?hidden=\{!searchOpen\}/);
  assert.match(runtimeSource, /function initializeHeader\(\)/);
  assert.match(runtimeSource, /searchPanelElement\.hidden = !searchOpen/);
  assert.equal((pageSource.match(/header-state-icon-open/g) || []).length, 2);
  assert.match(styleSource, /\[aria-expanded="true"\] > \.header-state-icon-closed[\s\S]*?display:\s*none/);
  assert.match(styleSource, /\[aria-expanded="true"\] > \.header-state-icon-open[\s\S]*?display:\s*inline-flex/);
  assert.match(styleSource, /\.desktop-search\s*\{\s*display:\s*none;/);
  assert.match(styleSource, /\.mobile-search-button\s*\{[\s\S]*?display:\s*inline-flex;/);
  assert.match(styleSource, /\.mobile-search-panel\.is-open,[\s\S]*?display:\s*block;/);
  assert.match(styleSource, /\.header-navigation\.is-open\s*\{\s*display:\s*block;/);
  assert.match(styleSource, /\.mobile-search-button\s*\{[\s\S]*?align-self:\s*center;[\s\S]*?border-color:\s*transparent;[\s\S]*?background:\s*transparent;/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.header-inner\s*\{\s*grid-template-columns:\s*max-content minmax\(0,1fr\) auto auto;[\s\S]*?\.primary-nav\s*\{\s*grid-column:\s*2;\s*justify-content:\s*center;/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.mobile-search-button\s*\{\s*grid-column:\s*3;[\s\S]*?\.menu-button\s*\{\s*grid-column:\s*4;/);
});

test("the desktop global search is geometrically centered without changing mobile search", async () => {
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(styleSource, /@media \(min-width: 1181px\)[\s\S]*?\.desktop-search\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?top:\s*calc\(var\(--header-height\) \/ 2\);[\s\S]*?left:\s*50%;[\s\S]*?width:\s*clamp\(360px, 32vw, 520px\);[\s\S]*?transform:\s*translate\(-50%, -50%\)/);
  assert.match(styleSource, /@media \(min-width: 1181px\) and \(max-width: 1680px\)[\s\S]*?\.desktop-search\s*\{\s*width:\s*360px;[\s\S]*?\.social-link span\s*\{[\s\S]*?clip:\s*rect\(0, 0, 0, 0\)/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.desktop-search\s*\{\s*display:\s*none;/);
});

test("desktop Skill details match project-detail scale without changing mobile or project pages", async () => {
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(styleSource, /@media \(min-width: 901px\)[\s\S]*?\.skill-document\s*\{\s*width:\s*min\(100%, 1420px\);[\s\S]*?\.skill-document h1\s*\{\s*font-size:\s*clamp\(46px, 3\.8vw, 58px\);[\s\S]*?\.skill-document \.skill-human-title\s*\{\s*font-size:\s*22px;[\s\S]*?\.skill-document \.standfirst\s*\{[\s\S]*?font-size:\s*17px/);
  assert.doesNotMatch(styleSource, /\.skill-document[^}]*\b(?:zoom|transform)\s*:/, "Skill scale must not use zoom or transform hacks");
});

test("project hero stays product-first and technical prose wraps on mobile", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  const heroMainIndex = pageSource.indexOf('className="project-hero-main"');
  const heroCopyIndex = pageSource.indexOf('className="project-hero-copy"', heroMainIndex);
  const entryIndex = pageSource.indexOf('<aside className="snapshot-card project-entry-card"', heroCopyIndex);
  const heroEnd = pageSource.indexOf("function ProjectNav", heroMainIndex);
  assert.ok(heroMainIndex >= 0 && heroCopyIndex > heroMainIndex && entryIndex > heroCopyIndex, "project hero must contain product copy followed by the project entry");
  assert.doesNotMatch(pageSource.slice(heroMainIndex, heroEnd), /project-headline-facts|currentProject\.heroFacts/, "technical facts still occupy the hero");
  assert.match(styleSource, /\.project-hero\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) minmax\(230px, 300px\);[\s\S]*?align-items:\s*start;/);
  assert.match(styleSource, /\.plain-list li,[\s\S]*?overflow-wrap:\s*anywhere;/);
  assert.match(styleSource, /\.failure-list dt,[\s\S]*?overflow-wrap:\s*anywhere;/);
});

test("the project card exposes visible module links instead of a dropdown", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /project-module-link-row/);
  assert.match(pageSource, /moduleOptions\.slice\(index \* 7, index \* 7 \+ 7\)/);
  assert.match(pageSource, /"--mobile-last-span": row\.length % 4 === 0 \? 1 : 5 - \(row\.length % 4\)/);
  assert.match(await readFile(path.join(projectRoot, "app", "style.css"), "utf8"), /grid-column:\s*span var\(--mobile-last-span, 1\)/);
  assert.match(pageSource, /projectCatalog\.map\(\(entry\) => <ProjectCard/);
  assert.match(pageSource, /currentProject\.route/);
  assert.match(pageSource, /project-repository-button/);
  assert.match(pageSource, /project-hero-repository-link/);
  assert.match(pageSource, /https:\/\/github\.com\/\$\{entry\.registration\.source\.repo\}/);
  assert.match(pageSource, /item\.label === "Skills \/ Plugins" \? item\.label : annotateTerms\(item\.label\)/);
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
  assert.equal(annotate("Current.md"), "Current.md", "file identifiers must not be split by term annotation");
  assert.equal(annotate("Current."), "Current（当前状态）.", "sentence punctuation must still allow a useful explanation");
  for (const value of ["Current task", "worktree", "saved local Git project", "Git（版本管理系统）"]) {
    const once = annotate(value);
    assert.equal(annotate(once), once, `${value} annotation is not idempotent`);
  }
  const protectPaths = createTermAnnotator([["skills", "能力入口"], ["public", "公开"]]);
  for (const exact of ["E:\\.agents\\skills", "C:\\ProgramData\\PCConfig\\public\\status.json", "https://example.com/public/status.json", "/opt/public/skills/config.json", "--public-mode", "`git worktree list --porcelain`", "`public.status.json`", "`skills/current`"] ) {
    assert.equal(protectPaths(exact), exact, `identifier/path was rewritten: ${exact}`);
  }
});

test("reader outcomes appear before technical decision lists", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /module\.result[\s\S]{0,700}<ThreeStateSummary \{\.\.\.module\.readerStates\} kind=\{entry\.kind\} labels=\{module\.stateLabels\} \/>[\s\S]{0,300}module\.decisionImpact/);
  assert.match(pageSource, /outcome\.result[\s\S]{0,700}<ThreeStateSummary \{\.\.\.outcome\.readerStates\} \/>[\s\S]{0,400}outcome\.changes/);
});

test("project technical facts remain complete without taking over the first viewport", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const heroSource = pageSource.slice(pageSource.indexOf("function ProjectHero"), pageSource.indexOf("function ProjectNav"));
  assert.doesNotMatch(heroSource, /currentProject\.heroFacts|project-headline-facts/, "technical facts still render before the reading layers");
  assert.match(pageSource, /currentProject\.heroFacts/);
  assert.match(pageSource, /project-headline-facts/);
  assert.ok(pageSource.indexOf('ProjectReadingPanel id="technical"') < pageSource.lastIndexOf("currentProject.heroFacts"), "hero facts are not inside the technical layer");
  for (const entry of projectCatalog) {
    assert.ok(Array.isArray(entry.project.heroFacts) && entry.project.heroFacts.length >= 4 && entry.project.heroFacts.length <= 6, `${entry.project.slug} must retain 4–6 technical facts`);
    for (const fact of entry.project.heroFacts) {
      assert.ok(fact.label?.length >= 2, `${entry.project.slug} has an unnamed technical fact`);
      assert.ok(fact.value?.length >= 18, `${entry.project.slug}/${fact.label} is too vague`);
    }
  }
  const asrFacts = chineseAsrProject.heroFacts.map((fact) => fact.value).join("\n");
  for (const model of ["SenseVoiceSmall", "Qwen3-ASR-1.7B", "FireRedASR2-LLM", "Paraformer", "CAM++", "Qwen Audio 3.0 ASR Flash", "Fun-ASR-Nano-2512", "Whisper Large V3"]) {
    assert.ok(asrFacts.includes(model), `ChineseASR technical reference hides model: ${model}`);
  }
  const agentsFacts = project.heroFacts.map((fact) => fact.value).join("\n");
  assert.ok(agentsFacts.includes(panelSnapshot.authority.releaseId));
  assert.ok(agentsFacts.includes(panelSnapshot.authority.previous.release_id));
  const timeAuditFacts = timeAuditProject.heroFacts.map((fact) => fact.value).join("\n");
  for (const currentFact of ["1 秒", "3 秒", "PostgreSQL 15", "45432", "Grafana 13.0.2", "53000", "6 张仪表盘", "78 个面板"]) {
    assert.ok(timeAuditFacts.includes(currentFact), `TimeAudit technical reference hides: ${currentFact}`);
  }
  assert.match(timeAuditFacts, /本机/);
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
  assert.match(projectRules, /Product names, platform\s+labels and otherwise public-safe paths or identifiers[\s\S]*?are not sensitive/);
  assert.match(projectRules, /positive L3\+ evidence/);
  assert.doesNotMatch(projectRules, /prohibited platform identity/);
  assert.match(projectRules, /what this thing[\s\S]{0,80}does for[\s\S]{0,500}concrete problem or accident[\s\S]{0,500}realistic ordinary request[\s\S]{0,500}owner receives/);
  assert.match(projectRules, /content\s+quality floor, not a shared card layout[\s\S]{0,260}System stays medium-density/);
  assert.match(projectRules, /adding more words never substitutes for removing mystery copy/);
  assert.match(projectRules, /three reading layers: `速览`, `产品`\s+and\s+`技术`/);
  assert.match(projectRules, /product principles and design highlights/);
  assert.match(projectRules, /release id, commit, test count,[\s\S]{0,160}not the\s+product's identity/);
  assert.match(projectRules, /Public pages never expose internal presentation or maintenance labels/);
  assert.match(projectRules, /English（中文含义）/);
  assert.match(projectRules, /single-pass, longest-phrase safety net/);
  assert.match(projectRules, /Context-dependent words such as token, source, candidate/);
  assert.match(projectRules, /Owner, Provider, Authority and root/);
  assert.match(projectRules, /Field completeness,[\s\S]{0,200}correct terms do\s+not make that page understandable/);
  assert.match(projectRules, /Except for reviewed L3\+ values[\s\S]{0,180}requires withholding and reusable secrets/);
  assert.match(projectRules, /exact models,[\s\S]{0,260}providers,[\s\S]{0,260}versions,[\s\S]{0,400}E2E/);
  assert.match(projectRules, /first project viewport stays product-first[\s\S]{0,260}short project\s+status[\s\S]{0,220}snapshot boundary/);
  assert.match(projectRules, /Exact model stacks,[\s\S]{0,220}remain complete in `技术`/);
  assert.match(projectRules, /Public visibility is never a reason to suppress a non-secret fact/);
  assert.match(projectRules, /Sensitivity is decided from the actual value, not the field name/);
  assert.match(projectRules, /Process\s+names, executable paths, command lines, window titles/);
  assert.match(projectRules, /not blanket-sensitive and may be public when useful/);
  assert.match(projectRules, /PUBLIC personal-data decisions follow the active global authorization\s+contract's single classification table/);
  assert.match(projectRules, /neither copies, redefines nor independently\s+tightens that table/);
  assert.match(projectRules, /project-authored restriction cannot create its own\s+publication authority/);
  assert.match(projectRules, /`Codex Remote`, 微信 and `WeChatDirect` may therefore be stated directly/);
  assert.match(projectRules, /Every native subagent used for this website, at every descendant depth/);
  assert.match(projectRules, /exactly `gpt-5\.6-sol` with `max` effort/);
  assert.match(projectRules, /Luna, Terra, local aliases and\s+lower effort are forbidden/);
  assert.match(projectRules, /Every current and future website project may use multiple native subagents/);
  assert.match(projectRules, /materially improve the delivered\s+page/);
  assert.match(projectRules, /Do not reduce final quality merely to conserve an ample model quota/);
  assert.match(projectRules, /actual number of Sol Max agents from independent work surfaces and net\s+quality gain/);
  assert.match(projectRules, /zero remains valid/);
  assert.match(projectRules, /applies equally to projects added\s+after the current ten/);
  assert.match(projectRules, /Administrator or SYSTEM for this read-only snapshot/);
  assert.match(projectRules, /must not downgrade to a partial ordinary-user view/);
  assert.match(projectRules, /refresh-route defect[\s\S]{0,260}does not[\s\S]{0,120}blanket MAP release/);
  assert.match(projectRules, /One subagent owns one durable goal/);
  assert.match(projectRules, /clarify, narrow or expand[\s\S]{0,200}same goal/);
  assert.match(projectRules, /never replace that goal with an\s+unrelated objective/);
  assert.match(projectRules, /Accuracy remains the primary product requirement/);
  assert.match(projectRules, /When one\s+exact value is withheld, retain the component's public-safe identity/);
  assert.match(projectRules, /Only actual values\s+with positive L3\+ evidence enter review/);
  assert.match(projectRules, /Unregistered personal domains are outside the current MVP/);
  assert.match(projectRules, /independent product judgment/);
  assert.match(projectRules, /Do not copy a README section by section/);
  assert.match(projectRules, /Each project owns its\s+real module count/);
  assert.match(projectRules, /projectless unless the\s+owner explicitly selected a project/);
  assert.match(projectRules, /returned task id\s+is the creation receipt/);
  assert.match(projectRules, /standing-authorized to commit, normal-push\s+existing\s+PUBLIC\s+`main`/);
  assert.match(projectRules, /ai_refresh\.mode=manual_owner_only/);
  assert.match(projectRules, /source, rule and Skill events never create a website task/i);
  assert.match(projectRules, /This rule creates no Skill, watcher or Source hook/);
  assert.match(projectRules, /complete route-specific HTML at\s+build time/);
  assert.match(projectRules, /clicks must\s+not show a spinner, skeleton or blank state/);
  assert.match(projectRules, /Likely transitions must issue\s+non-blocking prefetch hints before interaction/);
  assert.match(projectRules, /native navigation never\s+waits for a hint to finish/);
  assert.match(projectRules, /closes Project, Rules and Skills pages[\s\S]{0,220}then derives whether System still tells the truth/);
  assert.match(projectRules, /Git history,[\s\S]{0,120}identify candidates only/);
  assert.match(projectRules, /System remains byte-identical/);
  assert.match(projectRules, /manual_owner_only[\s\S]{0,180}keeps its[\s\S]{0,120}last verified published snapshot/);
  assert.match(projectRules, /blind-reader product defects are construction defects,[\s\S]{0,180}not incremental drift/);
  assert.match(projectRules, /must not replace richer valid prose with a shorter,[\s\S]{0,180}snapshot/);
});

test("the deployed System content explains generic AI productivity and long-running mechanisms", () => {
  const systemText = JSON.stringify({ systemHomeHero, systemScenarios, systemDependencyNodes, systemProjectDomains, systemRuleStories, systemSkillFamilies });
  for (const capability of ["理解自然语言", "推理", "研究", "图片与文档", "使用工具", "代码", "浏览器", "并行协作"]) {
    assert.ok(systemText.includes(capability), `System content omits generic capability: ${capability}`);
  }
  for (const phrase of ["外部生产力", "不是个人项目开发出来的基础智能", "个人 AI 协作系统", "全部项目", "5 份现行规则", "自然语言能力入口"]) {
    assert.ok(systemText.includes(phrase), `System content omits product boundary: ${phrase}`);
  }
  assert.equal(systemRuleStories.length, 5);
  assert.equal(systemSkillFamilies.flatMap((family) => family.members).length, skills.length);
  for (const entry of projectCatalog) assert.ok(systemText.includes(entry.project.route), `System content omits project entry: ${entry.project.slug}`);
  for (const item of skills) assert.ok(systemText.includes(`/skills/${item.slug}`), `System content omits Skill: ${item.slug}`);
  for (const phrase of ["施工责任（Execution Owner）", "重叠时只停止对应写入", "登记表修订号", "连同检查点正式移交", "长任务状态与断点接续", "满足同一完整验收时", "自造复杂度导致失败时先删除或绕开"]) assert.ok(systemText.includes(phrase), `System content omits long-running mechanism: ${phrase}`);
  const documentMaterialsSurface = JSON.stringify({
    asset: systemProjectDomains.flatMap((domain) => domain.assets).find((asset) => asset.id === "formal-materials"),
    node: systemDependencyNodes.find((node) => node.id === "document-materials-skill"),
    family: systemSkillFamilies.flatMap((family) => family.members).find((item) => item.slug === "document-materials")
  });
  assert.match(documentMaterialsSurface, /文书和材料制作/);
  assert.match(documentMaterialsSurface, /\/skills\/document-materials/);
  assert.doesNotMatch(documentMaterialsSurface, /personal-litigation|litigation|lawsuit|\blegal\b|legal-filing-kit|诉讼|法律|案件|起诉|法院/i);
  const hookNode = systemDependencyNodes.find((node) => node.id === "collaboration-hooks");
  const hookText = JSON.stringify(hookNode);
  assert.match(hookText, /Hook.*身份.*规则/s, "System omits the runtime Hook identity path");
  assert.match(hookText, /创建协作者前再复核/, "System omits the pre-spawn Hook check");
  assert.doesNotMatch(systemText, /gpt-5\.|Luna|Terra|Sol Max|Harness/i, "System content must stay model, vendor and runtime-wrapper neutral");
});

test("long pages expose one unobtrusive back-to-top control", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const runtimeSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(pageSource, /data-back-to-top[\s\S]{0,180}回到页面顶部/);
  assert.match(runtimeSource, /function initializeBackToTop\(\)[\s\S]*?window\.scrollTo\(\{ top: 0,[\s\S]*?behavior:/);
  assert.match(runtimeSource, /window\.scrollY < Math\.max\(520, window\.innerHeight \* 0\.75\)/);
  assert.match(runtimeSource, /const footer = document\.querySelector\("\.site-footer"\)/);
  assert.match(runtimeSource, /const footerVisible = footer[\s\S]{0,160}button\.hidden =[\s\S]{0,160}\|\| footerVisible/);
  assert.match(styleSource, /\.back-to-top:hover,[\s\S]{0,180}border-color:\s*var\(--green\)/);
});

test("the global footer exposes useful destinations instead of decorative repetition", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const runtimeSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(pageSource, /function SiteFooter\(\)/);
  assert.match(pageSource, /function FooterEmailLink\(\{ item \}\)/);
  assert.match(pageSource, /data-footer-email-copy=\{site\.email\}/);
  assert.match(pageSource, /data-footer-email-copy-button/);
  assert.match(runtimeSource, /function initializeFooterEmailCopy\(\)/);
  assert.match(runtimeSource, /navigator\.clipboard\?\.writeText[\s\S]{0,120}navigator\.clipboard\.writeText\(value\)/);
  assert.match(runtimeSource, /document\.execCommand\("copy"\)/);
  assert.match(runtimeSource, /label\.textContent = success \? "已复制" : "复制失败"/);
  assert.match(runtimeSource, /const restoreFocus = document\.activeElement === button/);
  assert.match(runtimeSource, /button\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(runtimeSource, /button\.disabled = true/);
  assert.match(runtimeSource, /initializeFooterEmailCopy\(\)/);
  assert.match(pageSource, /从总览进入真正拥有内容的页面/);
  assert.match(pageSource, /这是最后一次验证并发布的只读快照，不是后台实时控制台/);
  assert.match(pageSource, /<SiteFooter \/><BackToTopButton \/>/);
  const rootHtml = await readFile(path.join(projectRoot, "dist", "index.html"), "utf8");
  for (const item of primaryNav) assert.ok(rootHtml.includes(canonicalUrl(item.href)), `Footer omits full internal URL for ${item.label}`);
  for (const item of socialLinks) assert.ok(rootHtml.includes(item.href), `Footer omits external destination for ${item.label}`);
  assert.match(rootHtml, /aria-label="复制邮箱地址"/);
  assert.ok(rootHtml.includes(`${site.url}/`), "Footer omits the canonical site URL");
  assert.match(styleSource, /\.site-footer\s*\{[\s\S]*?border-top:\s*2px solid var\(--green\)/);
  assert.match(styleSource, /\.site-footer-links > a > code[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(styleSource, /\.site-footer-email-row > button\s*\{[\s\S]*?min-width:\s*66px;[\s\S]*?border:\s*1px solid var\(--green\)/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.site-footer-inner\s*\{\s*grid-template-columns:\s*minmax\(0,1fr\)/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.system-directories\s*\{\s*padding-bottom:\s*24px;/);
});

test("the authoritative desktop scale baseline follows the older compact block", async () => {
  const styles = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  const compactIndex = styles.lastIndexOf("Compact dashboard density");
  const scaleIndex = styles.lastIndexOf("Authoritative desktop scale baseline");
  assert.ok(compactIndex >= 0 && scaleIndex > compactIndex, "desktop scale is overridden by an older compact block");
  const scaleBlock = styles.slice(scaleIndex);
  assert.match(scaleBlock, /@media \(min-width: 901px\)/);
  assert.match(scaleBlock, /--max-width:\s*1680px/);
  assert.match(scaleBlock, /body\s*\{\s*font-size:\s*18px/);
});

test("the shared enhancement stays within the current 12 KiB JS and 20 KiB CSS review lines", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const enabledProjectCount = registry.projects.filter((item) => item.enabled).length;
  assert.equal(registry.refresh_policy.shared_interaction_gzip_budget_kib, 12);
  assert.equal(registry.refresh_policy.shared_css_gzip_budget_kib, 20);
  assert.equal(registry.refresh_policy.search_index_gzip_budget_kib, 64);
  assert.equal(registry.refresh_policy.project_search_index_gzip_budget_kib, 64);
  assert.equal(registry.refresh_policy.detail_loading_mode, "route_specific_static_native_document");
  assert.match(registry.refresh_policy.bundle_budget_semantics, /anti-bloat review threshold/);
  assert.match(registry.refresh_policy.bundle_budget_semantics, /not permanent content ceilings/);
  assert.match(registry.refresh_policy.bundle_budget_semantics, /smallest justified increase/);
  assert.equal(enabledProjectCount, 10);
  const assetsRoot = path.join(projectRoot, "dist", "assets");
  const javascript = (await readdir(assetsRoot)).filter((item) => item.endsWith(".js"));
  assert.ok(javascript.length >= 1, "production build has no enhancement JavaScript");
  const javascriptSources = await Promise.all(javascript.map((item) => readFile(path.join(assetsRoot, item), "utf8")));
  const gzipBytes = javascriptSources.reduce((total, source) => total + gzipSync(source).length, 0);
  assert.ok(gzipBytes <= registry.refresh_policy.shared_interaction_gzip_budget_kib * 1024, `shared enhancement JavaScript gzip ${gzipBytes} exceeds registry budget`);
  const stylesheets = (await readdir(assetsRoot)).filter((item) => item.endsWith(".css"));
  assert.ok(stylesheets.length >= 1, "production build has no shared stylesheet");
  const stylesheetSources = await Promise.all(stylesheets.map((item) => readFile(path.join(assetsRoot, item), "utf8")));
  const stylesheetGzipBytes = stylesheetSources.reduce((total, source) => total + gzipSync(source).length, 0);
  assert.ok(stylesheetGzipBytes <= registry.refresh_policy.shared_css_gzip_budget_kib * 1024, `shared CSS gzip ${stylesheetGzipBytes} exceeds registry budget`);
  const runtimeSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  const htmlTemplate = await readFile(path.join(projectRoot, "static-site", "index.html"), "utf8");
  const clientGraph = `${runtimeSource}\n${javascriptSources.join("\n")}`;
  assert.doesNotMatch(runtimeSource, /site-content|content-(?:core|skills|pcconfig|github-index|chinese-asr|timeaudit|pc-panel-hub|cacb|learning|codex-remote|personal-health)/, "browser runtime must not import narrative packages");
  assert.doesNotMatch(clientGraph, /\b(?:fetch|import)\s*\(/, "browser runtime must not use click-time network loading");
  assert.match(runtimeSource, /function handleImageDoubleClick\(\)[\s\S]{0,180}else resetZoom\(\)/, "double-click zoom-out must reset gallery scroll");
  assert.match(htmlTemplate, /<noscript>[\s\S]*?\[data-rule-panel\]\[hidden\][\s\S]*?\[data-project-reading-panel\]\[hidden\][\s\S]*?display:\s*block\s*!important/, "Rules and project reading layers must expose complete static content when JavaScript is disabled");
  for (const { project: currentProject } of projectCatalog) {
    assert.ok(!clientGraph.includes(currentProject.summary.slice(0, 80)), `${currentProject.slug} narrative leaked into client JavaScript`);
  }
  const generatedIndex = await readFile(path.join(projectRoot, "app", "project-content-index.generated.js"), "utf8");
  assert.doesNotMatch(generatedIndex, /=>\s*import\(/, "project details must not wait for a click-time dynamic import");
  const rootHtml = await readFile(path.join(projectRoot, "dist", "index.html"), "utf8");
  assert.match(rootHtml, /<script src="\/search-index\.js"><\/script>/, "build must load the shared compact search index before enhancement");
  assert.doesNotMatch(rootHtml, /__WLY_SEARCH_INDEX__=/, "search index must not be duplicated into every route HTML");
  const searchAsset = await readFile(path.join(projectRoot, "dist", "search-index.js"), "utf8");
  const indexMatch = searchAsset.match(/^window\.__WLY_SEARCH_INDEX__=([\s\S]*);\s*$/);
  assert.ok(indexMatch, "shared search index asset is invalid");
  const compactIndex = JSON.parse(indexMatch[1]);
  assert.ok(gzipSync(searchAsset).length <= registry.refresh_policy.search_index_gzip_budget_kib * 1024, "compact search index exceeds registry budget");
  assert.ok(compactIndex.length >= projectCatalog.length + rulesSnapshot.rules.length + skills.length);
  assert.ok(compactIndex.every((entry) => entry.type !== "项目内容"), "shared search index must not carry project module narratives");
  for (const entry of compactIndex) {
    assert.deepEqual(Object.keys(entry), ["type", "group", "scopes", "projectSlug", "title", "detail", "href", "aliases", "search"]);
    assert.ok(entry.detail.length <= 240, `${entry.href} search summary is not compact`);
    assert.doesNotMatch(entry.search, /\[object Object\]/, `${entry.href} compact search contains an unexpanded object`);
    assert.ok(entry.search.length <= (entry.type === "项目" ? 1800 : 900), `${entry.href} compact search phrases are unbounded`);
  }
  const projectSearchAsset = await readFile(path.join(projectRoot, "dist", "search-projects.js"), "utf8");
  const projectIndexMatch = projectSearchAsset.match(/^window\.__WLY_PROJECT_SEARCH_INDEX__=([\s\S]*);\s*$/);
  assert.ok(projectIndexMatch, "all-project search index asset is invalid");
  const compactProjectIndex = JSON.parse(projectIndexMatch[1]);
  assert.ok(gzipSync(projectSearchAsset).length <= registry.refresh_policy.project_search_index_gzip_budget_kib * 1024, "all-project compact search index exceeds registry budget");
  assert.equal(compactProjectIndex.length, projectCatalog.reduce((count, entry) => count + entry.modules.length, 0));
  assert.ok(compactProjectIndex.every((entry) => entry.type === "项目内容"), "all-project search index must contain only project modules");
  for (const entry of compactProjectIndex) {
    assert.deepEqual(Object.keys(entry), ["type", "group", "scopes", "projectSlug", "title", "detail", "href", "aliases", "search"]);
    assert.ok(entry.detail.length <= 240, `${entry.href} project search summary is not compact`);
    assert.doesNotMatch(entry.search, /\[object Object\]/, `${entry.href} project search contains an unexpanded object`);
    assert.ok(entry.search.length <= 900, `${entry.href} project search phrases are unbounded`);
  }
  const projectSearchIndices = [];
  for (const entry of projectCatalog) {
    const projectAsset = await readFile(path.join(projectRoot, "dist", `search-project-${entry.project.slug}.js`), "utf8");
    const projectMatch = projectAsset.match(/^window\.__WLY_PROJECT_SEARCH_INDEX__=([\s\S]*);\s*$/);
    assert.ok(projectMatch, `${entry.project.slug} project search index asset is invalid`);
    const projectIndex = JSON.parse(projectMatch[1]);
    assert.ok(gzipSync(projectAsset).length <= 8 * 1024, `${entry.project.slug} project search index exceeds 8 KiB gzip`);
    assert.equal(projectIndex.length, entry.modules.length, `${entry.project.slug} project search index does not match its module count`);
    assert.ok(projectIndex.every((candidate) => candidate.type === "项目内容" && candidate.projectSlug === entry.project.slug), `${entry.project.slug} project search index leaks another project`);
    projectSearchIndices.push(...projectIndex);
  }
  assert.deepEqual(projectSearchIndices, compactProjectIndex, "per-project search indices do not reconstruct the all-project index");
  const completeCompactIndex = [...compactIndex, ...compactProjectIndex];
  const compactAliasCases = [
    ["C盘规则为什么不能阻塞spawn", "重大动作保护", "/rules/?rule=protected_major_actions_contract"],
    ["dirty source 不能冒充 current release", "重大动作保护", "/rules/?rule=protected_major_actions_contract"],
    ["同一个目标不要反复问我授权", "授权与委派", "/rules/?rule=authorization_delegation_contract"],
    ["本地构建通过为什么还不能说网站完成", "三控制面上下文、耐久状态与完成证据", "/projects/agents/context-evidence/"],
    ["怎么避免全局规则覆盖项目自己的验收方式", "全局根规则", "/rules/?rule=agents_root_rules"],
    ["过去一小时为什么卡", "timeaudit-diagnostics", "/skills/timeaudit-diagnostics/"]
  ];
  for (const [query, title, href] of compactAliasCases) {
    const match = searchCompactEntries(completeCompactIndex, query)[0];
    assert.equal(match?.title, title, `production compact search loses: ${query}`);
    assert.equal(match?.href, href, `production compact search misroutes: ${query}`);
  }
  const compactSystemCases = [
    ["重要邮件原始发件人去重", "自动协作", "/#system-automations"],
    ["仓库公开性分支远端工作树同步状态怎么确认", "系统组成", "/skills/project-entry-gate/"],
    ["多个 AI 同时改一个文件怎么办", "系统组成", "/projects/agents/authorization-owner/"],
    ["Hook 创建子代理前核对身份", "系统组成", "/skills/native-economy-routing/"],
    ["材料生成平台收到接收方处理", "系统组成", "/skills/document-materials/"],
    ["源码或构建通过能不能证明网页发布", "验证层", "/#evidence-test"]
  ];
  for (const [query, type, href] of compactSystemCases) {
    const full = searchPanel(query, "system")[0];
    const compact = searchCompactEntries(compactIndex, query, "system")[0];
    assert.equal(full?.type, type, `full System search mistypes: ${query}`);
    assert.equal(compact?.type, type, `compact System search mistypes: ${query}`);
    assert.equal(canonicalPath(new URL(full.href, "https://wly0829.cn").pathname) + new URL(full.href, "https://wly0829.cn").hash, href, `full System search misroutes: ${query}`);
    assert.equal(compact?.href, href, `compact System search misroutes: ${query}`);
    assert.ok(compact.detail.length >= 12, `compact System search has no useful summary: ${query}`);
  }
  for (const entry of completeCompactIndex) {
    for (const alias of entry.aliases) {
      const expected = searchPanel(alias)[0];
      const target = new URL(expected.href, "https://wly0829.cn");
      const expectedHref = `${canonicalPath(target.pathname)}${target.search}${target.hash}`;
      const actual = searchCompactEntries(completeCompactIndex, alias)[0];
      assert.equal(actual?.title, expected.title, `compact alias changes full-search title: ${alias}`);
      assert.equal(actual?.href, expectedHref, `compact alias changes full-search route: ${alias}`);
    }
  }
});

test("TimeAudit reuses the existing website runtime without services, databases or duplicate state", async () => {
  const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), ["@icons-pack/react-simple-icons", "@phosphor-icons/react", "react", "react-dom"].sort());
  assert.deepEqual(Object.keys(packageJson.devDependencies).sort(), ["@vitejs/plugin-react", "vite"].sort());
  const forbiddenRuntimeScripts = Object.keys(packageJson.scripts).filter((name) => /^(?:server|serve|daemon|watch|poll|sync|database|db)(?::|$)/i.test(name));
  assert.deepEqual(forbiddenRuntimeScripts, [], "visual project additions must not add a website service, watcher, poller, sync job or database");
  const timeAuditAppFiles = (await readdir(path.join(projectRoot, "app"))).filter((name) => /timeaudit/i.test(name)).sort();
  assert.deepEqual(timeAuditAppFiles, ["content-timeaudit.js"], "TimeAudit must have one narrative package instead of duplicate app state");
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.refresh_policy.mode, "ai_managed_on_demand");
  assert.match(registry.refresh_policy.fact_collector_boundary, /never write narrative content/);
  assert.match(registry.refresh_policy.anti_append_policy, /never append refresh logs/);
});

test("the maintenance registry drives exactly the ten accepted project packages", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.schema, "wly.personal-panel-project-registry.v1");
  assert.equal(registry.refresh_policy.mode, "ai_managed_on_demand");
  assert.equal(registry.refresh_policy.semantic_writer, "website_ai_task_only");
  assert.equal(registry.refresh_policy.website_project_type, "projectless");
  assert.match(registry.refresh_policy.website_task_rule, /asynchronous projectless/);
  assert.match(registry.refresh_policy.website_task_rule, /task-id return is the dispatch receipt/);
  assert.match(registry.refresh_policy.publication_mode, /automatically commit, normal-push existing PUBLIC main/);
  assert.match(registry.refresh_policy.full_refresh_rule, /unchanged projects remain byte-identical/);
  assert.match(registry.refresh_policy.anti_append_policy, /never append refresh logs/);
  assert.match(registry.refresh_policy.evolution_policy, /date or date range/);
  assert.match(registry.refresh_policy.rule_refresh_boundary, /verified current E release/);
  assert.equal(registry.refresh_policy.trigger, "displayed_fact_or_explanation_changed");
  assert.equal(registry.refresh_policy.only_private_document, "docs/design/private-content-rules.md");
  assert.equal(registry.refresh_policy.default_presentation_mode, "real_dashboard");
  assert.deepEqual(registry.projects.map((item) => item.id), ["agents", "pcconfig", "github-index", "chinese-asr", "timeaudit", "pc-panel-hub", "cacb", "learning", "codex-remote", "personal-health"]);
  assert.deepEqual(registry.projects.map((item) => item.order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(registry.projects.map((item) => item.route), ["/projects/agents", "/projects/pcconfig", "/projects/github-index", "/projects/chinese-asr", "/projects/timeaudit", "/projects/pc-panel-hub", "/projects/cacb", "/projects/learning", "/projects/codex-remote", "/projects/personal-health"]);
  assert.deepEqual(projectCatalog.map((entry) => entry.registration.id), registry.projects.map((item) => item.id));
  for (const item of registry.projects) {
    assert.equal(item.enabled, true);
    assert.ok(registry.refresh_policy.allowed_presentation_modes.includes(item.presentation_mode));
    assert.match(item.ai_refresh.content_path, /^app\/content-[a-z-]+\.js$|^app\/content-core\.js$/);
    assert.ok(Number.isInteger(item.ai_refresh.semantic_revision) && item.ai_refresh.semantic_revision >= 1);
    if (item.ai_refresh.mode === "manual_owner_only") {
      assert.equal(item.presentation_mode, "curated_packaging");
      assert.equal(item.ai_refresh.automatic_handoff, false);
      assert.ok(item.ai_refresh.collectors.length >= 1);
      assert.deepEqual(item.ai_refresh.conditional_collectors, []);
      assert.deepEqual(item.impact_sources, []);
    } else {
      assert.equal(item.presentation_mode, "real_dashboard");
      assert.ok(item.ai_refresh.collectors.length >= 3);
      if (item.id !== "agents") assert.ok(item.ai_refresh.conditional_collectors.length >= 2);
      assert.ok(item.impact_sources.length >= 3);
    }
    assert.ok(item.ai_refresh.scope.length >= 10);
  }
  assert.ok(registry.projects[0].impact_sources.length >= 5);
  assert.deepEqual(registry.projects.filter((item) => item.source.visibility === "PUBLIC").map((item) => item.id), ["github-index", "chinese-asr", "timeaudit", "pc-panel-hub", "codex-remote"]);
  assert.ok(!registry.projects.some((item) => item.id === "website"));

  const generatedIndex = await readFile(path.join(projectRoot, "app", "project-content-index.generated.js"), "utf8");
  for (const item of registry.projects) assert.ok(generatedIndex.includes(`["${item.id}"`), `generated project index is missing ${item.id}`);
  const generation = JSON.parse(execFileSync(process.execPath, [path.join(projectRoot, "scripts", "generate-project-content-index.mjs")], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
  assert.equal(generation.status, "no_change");

  for (const entry of projectCatalog) {
    if (entry.registration.ai_refresh.mode === "manual_owner_only") {
      assert.deepEqual(entry.registration.impact_sources, []);
      continue;
    }
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

test("TimeAudit registry binds public-safe aggregate refresh evidence and impact sources", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "timeaudit");
  assert.ok(registration, "TimeAudit registry entry is missing");
  assert.equal(registration.order, 5);
  assert.equal(registration.route, "/projects/timeaudit");
  assert.equal(registration.presentation_mode, "real_dashboard");
  assert.equal(registration.ai_refresh.content_path, "app/content-timeaudit.js");
  assert.equal(registration.ai_refresh.semantic_revision, 3);
  assert.equal(registration.source.repo, "wlyaaaaa/TimeAudit");
  assert.equal(registration.source.visibility, "PUBLIC");
  assert.equal(registration.source.default_branch, "main");
  assert.match(registration.source.local_root, /TimeAudit$/);

  const collectors = registration.ai_refresh.collectors.join("\n");
  assert.match(collectors, /Get-ProjectAdmission\.ps1[\s\S]*wlyaaaaa\/TimeAudit/);
  assert.match(collectors, /test_pcconfig_anomaly_digest\.py/);
  assert.match(collectors, /pcconfig_anomaly_digest\.py[\s\S]*--after-utc[\s\S]*--until-utc/);
  assert.match(collectors, /test_timeaudit_diagnostic_summary\.py/);
  assert.match(collectors, /timeaudit_diagnostic_summary\.py[\s\S]*--hours 1/);
  assert.doesNotMatch(collectors, /test_telemetry_health|db_audit|SELECT\s|psql\b/i, "live refresh must consume only the bounded aggregate digest");

  const receiptBoundary = registration.ai_refresh.public_receipt_boundary;
  assert.ok(receiptBoundary && typeof receiptBoundary === "object", "TimeAudit public receipt boundary is missing");
  assert.match(JSON.stringify(receiptBoundary.allowed || []), /aggregate|聚合|schema|count|coverage|health/i);
  assert.match(JSON.stringify(receiptBoundary.provider_omits || []), /raw|window|process|machine|窗口|进程|机器/i);
  assert.match(String(receiptBoundary.provider_omits || ""), /not blanket public-content bans/i);
  assert.equal(receiptBoundary.diagnostic_schema, "timeaudit.diagnostic-summary.v1");
  assert.equal(receiptBoundary.diagnostic_owner, "timeaudit:diagnostic-history");
  assert.equal(receiptBoundary.diagnostic_maximum_window_hours, 168);
  assert.match(String(receiptBoundary.unknown_semantics || ""), /unknown|未知/i);

  assert.ok(registration.impact_sources.length >= 4);
  const impactPaths = registration.impact_sources.flatMap((source) => source.paths || []);
  for (const requiredPath of [
    "pcconfig_anomaly_digest.py",
    "test_pcconfig_anomaly_digest.py",
    "timeaudit_diagnostic_summary.py",
    "test_timeaudit_diagnostic_summary.py",
    "test_presentmon_fps_selection.py",
    "test_lifecycle_unknown_path.py",
    "test_activity_collection_state_lock.py",
    "check_telemetry_status.py",
    "test_telemetry_health.py",
    "test_backup_all_script.py",
    "test_restore_grafana.py"
  ]) {
    assert.ok(impactPaths.some((pattern) => impactPatternMatches(pattern, requiredPath)), `TimeAudit impact_sources miss ${requiredPath}`);
  }
  assert.match(JSON.stringify(registration.refresh_rules.semantic_review_required_when), /architecture|sampling|data model|actual-value|sensitivity|recovery|verification|架构|采样|数据模型|敏感|恢复|验证/i);
  assert.match(JSON.stringify(registration.refresh_rules.ignore_when), /raw|window|process|machine|cache|volume|log|原始|窗口|进程|机器|缓存|日志/i);
});

test("ChineseASR and TimeAudit expose complete source-to-result journeys and bounded module search projections", async () => {
  const packages = [
    { project: chineseAsrProject, modules: chineseAsrModules },
    { project: timeAuditProject, modules: timeAuditModules }
  ];
  for (const { project: candidate, modules: candidateModules } of packages) {
    assert.ok(candidate.searchAliases.length >= 4, `${candidate.slug} lacks natural project search aliases`);
    const moduleSlugs = candidateModules.map((item) => item.slug);
    assert.deepEqual(
      [...new Set(candidate.usageExamples.map((item) => item.moduleSlug))].sort(),
      [...moduleSlugs].sort(),
      `${candidate.slug} usage examples do not cover every real module`
    );
    for (const example of candidate.usageExamples) {
      assert.ok(moduleSlugs.includes(example.moduleSlug), `${candidate.slug} usage example points at an unknown module: ${example.moduleSlug}`);
    }
    for (const module of candidateModules) {
      assert.ok(module.searchAliases.length >= 4 && module.searchAliases.length <= 8, `${candidate.slug}/${module.slug} natural search aliases are not bounded`);
      assert.deepEqual(Object.keys(module.searchProjection), ["intents", "entities", "relations", "failureRecovery"], `${candidate.slug}/${module.slug} search projection shape drifted`);
      for (const [axis, values] of Object.entries(module.searchProjection)) {
        assert.ok(Array.isArray(values) && values.length >= 3 && values.length <= 8, `${candidate.slug}/${module.slug}.${axis} is not a bounded useful projection`);
        assert.ok(values.every((value) => typeof value === "string" && value.trim().length >= 2), `${candidate.slug}/${module.slug}.${axis} contains an empty search phrase`);
      }
    }
  }

  const taskRouting = chineseAsrModules.find((item) => item.slug === "task-routing");
  const taskText = JSON.stringify(taskRouting);
  for (const expected of ["jobs.json", "service_restarted", "不自动重跑", "音频内容 SHA-256", "稳定输出目录", "显式重试"]) {
    assert.ok(taskText.includes(expected), `ChineseASR task recovery omits: ${expected}`);
  }

  const audit = chineseAsrModules.find((item) => item.slug === "audit-evidence");
  const auditText = JSON.stringify({ result: audit.result, flow: audit.flow, concepts: audit.concepts, failures: audit.failures });
  for (const artifact of ["*.strict.md", "*.strict.audit.md", "*.strict.audit.json", "*.strict.review.json", "review.md", "*.strict.receipt.json", "*.raw.json", "manifest.json", "metrics.json", "benchmark.md", "benchmark.json"]) {
    assert.ok(auditText.includes(artifact), `ChineseASR reading journey omits: ${artifact}`);
  }
  assert.ok(audit.flow[0].includes("*.strict.md"), "ChineseASR must begin with the human-readable strict transcript");
  assert.match(auditText, /\[疑似\][\s\S]*回听原音频|回听原音频[\s\S]*\[疑似\]/);
  assert.match(auditText, /\[听不清\][\s\S]*(?:不等于没有语音|不能可靠转写)/);
  assert.match(auditText, /回执[\s\S]*(?:不证明文字正确|不证明文字是真的)/);
  const asrSnapshot = JSON.stringify({ boundary: chineseAsrProject.snapshotBoundary, facts: chineseAsrProject.currentState, hero: chineseAsrProject.heroFacts });
  for (const exact of ["70e3255", "345", "83.035 秒"]) assert.ok(asrSnapshot.includes(exact), `ChineseASR fresh evidence drifted: ${exact}`);

  const processForensics = timeAuditModules.find((item) => item.slug === "process-forensics");
  const processText = JSON.stringify(processForensics);
  assert.match(processText, /谁.*闪退|谁.*写盘|谁.*联网/);
  assert.match(processText, /Skill.*不返回进程名|不返回进程名/);
  assert.match(processText, /Grafana.*(?:资源盘|取证盘)/);
  const hardware = timeAuditModules.find((item) => item.slug === "hardware-performance");
  assert.match(JSON.stringify(hardware), /summary[\s\S]*Grafana|Grafana[\s\S]*summary/);

  const recovery = timeAuditModules.find((item) => item.slug === "backup-recovery");
  assert.equal(recovery.shortTitle, "安装与恢复");
  assert.equal(recovery.title, "安装、换机与数据恢复");
  const recoveryText = JSON.stringify(recovery);
  for (const expected of ["全新安装", "带历史换机", "灾后", "WSL2", "Docker Desktop", "setup_runtime.ps1", ".venv", "PostgreSQL", "audit-ingester", "Grafana", "schema.sql", "dump restore", "二选一", "datasource", "TimeAudit_AutoStart", "TimeAudit_Watchdog", "TimeAudit_DailyBackup", "heartbeat", "真实入库", "有界聚合", "http://localhost:53000", "历史缺口"]) {
    assert.ok(recoveryText.includes(expected), `TimeAudit install/recovery journey omits: ${expected}`);
  }
  assert.match(recoveryText, /快速部署\.md[\s\S]*(?:复制整个项目树|复制整个树)/);
  assert.match(recoveryText, /零丢失[\s\S]*(?:漂移|旧说明)|(?:漂移|旧说明)[\s\S]*零丢失/);
  assert.match(recoveryText, /每 5 分钟[\s\S]*(?:漂移|旧说明)|(?:漂移|旧说明)[\s\S]*每 5 分钟/);
  assert.match(recoveryText, /README[\s\S]*每 1 分钟/);
  assert.match(recoveryText, /本轮.*未.*最新 dump.*隔离整库恢复/);
  assert.equal(timeAuditProject.currentState.observedAt, "2026-08-31T11:18:10Z", "TimeAudit must not invent a newer observation time");

  for (const [query, href] of [
    ["服务重启后录音任务会自动重跑吗", "/projects/chinese-asr/task-routing"],
    ["严格模式两路模型是什么", "/projects/chinese-asr/models-modes"],
    ["两小时录音中断后接着跑", "/projects/chinese-asr/long-batch"],
    ["转写结果先看哪个文件", "/projects/chinese-asr/audit-evidence"],
    ["Speaker1是不是本人", "/projects/chinese-asr/speaker-attribution"],
    ["普通录音会上传云端吗", "/projects/chinese-asr/runtime-privacy"],
    ["为什么最近一段时间没采集数据", "/projects/timeaudit/collection-pipeline"],
    ["游戏卡顿先看摘要还是Grafana", "/projects/timeaudit/hardware-performance"],
    ["谁在后台写盘", "/projects/timeaudit/process-forensics"],
    ["今天电脑时间都花在哪", "/projects/timeaudit/usage-energy"],
    ["采集进程在但没有数据", "/projects/timeaudit/runtime-reliability"],
    ["新电脑第一次怎么装采集系统", "/projects/timeaudit/backup-recovery"]
  ]) assert.equal(searchPanel(query)[0]?.href, href, `natural project search misroutes: ${query}`);

  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.projects.find((item) => item.id === "chinese-asr").ai_refresh.semantic_revision, 3);
  assert.equal(registry.projects.find((item) => item.id === "timeaudit").ai_refresh.semantic_revision, 3);
});

test("GitHub index exposes the current 48-repository facts and complete owner journeys", async () => {
  assert.deepEqual(githubIndexProject.cardMetrics.map((item) => [item.label, item.value]), [
    ["仓库总账", "48"],
    ["公开 / 私有", "27 / 21"],
    ["本地 / 仅远端", "45 / 3"],
    ["当前差异", "0 delta · 0 issue"]
  ]);
  const publicText = JSON.stringify({ project: githubIndexProject, modules: githubIndexModules });
  for (const expected of ["806b668", "70efc65cdfec4b9cb1305ff48086744d", "23090 bytes", "work-delivery-copilot", "personal-formal-documents", "delta=0", "issue=0"]) {
    assert.ok(publicText.includes(expected), `GitHub index omits current owner fact: ${expected}`);
  }
  assert.doesNotMatch(publicText, /legal-filing-kit|personal-litigation|litigation|lawsuit|诉讼|法律|案件|起诉|法院/i, "Git project reintroduces retired lawsuit branding");
  assert.equal(githubIndexModules.length, 6);
  for (const module of githubIndexModules) {
    for (const key of ["intents", "entities", "relations", "failureRecovery"]) {
      assert.ok(Array.isArray(module.searchProjection?.[key]) && module.searchProjection[key].length >= 3, `${module.slug} lacks searchProjection.${key}`);
    }
  }
  assert.ok(githubIndexProject.usageExamples.every((item) => githubIndexModules.some((module) => module.slug === item.moduleSlug)), "Git usage example lacks an owning module");
  const createPrivate = githubIndexProject.usageExamples.find((item) => item.ask.includes("PRIVATE"));
  for (const expected of ["V 盘", "本地 main", "首个提交", "PRIVATE 远端", "origin", "正常 push", "真实默认分支", "登记", "恢复"]) {
    assert.ok(createPrivate.effect.includes(expected), `private repository creation journey omits: ${expected}`);
  }
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.projects.find((item) => item.id === "github-index").ai_refresh.semantic_revision, 4);
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
    },
    {
      project: timeAuditProject,
      modules: timeAuditModules,
      expectedSlug: "timeaudit",
      expectedOrder: 5,
      expectedModules: null
    },
    {
      project: cacbProject,
      modules: cacbModules,
      expectedSlug: "cacb",
      expectedOrder: 7,
      expectedModules: ["question-bank", "campaign-workspace", "identity-evidence", "deterministic-verification", "failure-reporting"]
    },
    {
      project: pcPanelHubProject,
      modules: pcPanelHubModules,
      expectedSlug: "pc-panel-hub",
      expectedOrder: 6,
      expectedModules: ["telemetry-trust", "case-panel-rendering", "serial-transport", "hs2-overlay", "power-recovery"]
    },
    {
      project: learningProject,
      modules: learningModules,
      expectedSlug: "learning",
      expectedOrder: 8,
      expectedModules: ["authoritative-research", "plain-language", "dialogue-revision", "questions-validation", "human-control-simple"]
    },
    {
      project: codexRemoteProject,
      modules: codexRemoteModules,
      expectedSlug: "codex-remote",
      expectedOrder: 9,
      expectedModules: ["same-task-control", "conversation-control", "models-approvals-context", "projects-files-input", "shared-realtime-architecture", "security-public-access", "versions-evidence"]
    },
    {
      project: personalHealthProject,
      modules: personalHealthModules,
      expectedSlug: "personal-health",
      expectedOrder: 10,
      expectedModules: ["current-evidence-route", "protected-foreground-refresh", "raw-preservation-resume", "offline-decision-brief", "evidence-three-state", "health-owner-boundary"]
    }
  ];
  const snapshotPackages = [{ project, modules }, ...packages.map(({ project: candidate, modules: candidateModules }) => ({ project: candidate, modules: candidateModules }))];
  const digitWords = { 0: "零", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "七", 8: "八", 9: "九" };
  for (const { project: candidate, modules: candidateModules } of snapshotPackages) {
    assert.ok(candidate.cardMetrics.length >= 3 && candidate.cardMetrics.length <= 4, `${candidate.slug} card metrics must stay compact`);
    assert.equal(new Set(candidate.cardMetrics.map((item) => item.label)).size, candidate.cardMetrics.length, `${candidate.slug} repeats a card metric label`);
    assert.ok(candidate.cardMetrics.every((item) => item.label.length <= 10 && item.value.length <= 18), `${candidate.slug} card metrics are not short display facts`);
    assert.ok(candidate.heroFacts.length >= 4 && candidate.heroFacts.length <= 6, `${candidate.slug} hero facts are incomplete`);
    assert.equal(new Set(candidate.heroFacts.map((item) => item.label)).size, candidate.heroFacts.length, `${candidate.slug} repeats a hero fact label`);
    assert.ok(candidate.heroFacts.every((item) => item.label?.length >= 2 && item.value?.length >= 18), `${candidate.slug} has an incomplete hero fact`);
    assert.match(candidate.currentState.observedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/, `${candidate.slug} observedAt is not precise UTC`);
    assert.ok(Number.isFinite(Date.parse(candidate.currentState.observedAt)), `${candidate.slug} observedAt is invalid`);
    assert.ok(candidate.currentState.label?.length >= 12, `${candidate.slug} currentState label is incomplete`);
    assert.ok(candidate.currentState.facts.length >= 2 && candidate.currentState.gaps.length >= 1, `${candidate.slug} currentState is incomplete`);
    if (candidate === project) {
      const observedRelease = candidate.currentState.label.match(/E\d+/)?.[0];
      assert.ok(observedRelease, "agents Owner observation omits its release identity");
      assert.ok(candidate.snapshotBoundary.includes(`${observedRelease} 观察`), "agents boundary mixes live release with an unlabelled historical Owner observation");
      assert.ok(candidate.cardMetrics.some((item) => item.label.includes(observedRelease) && item.value.includes("pass")), "agents local regression metric omits its observed release");
      assert.ok(candidate.cardMetrics.some((item) => item.label.startsWith("合同覆盖") && item.label.includes(observedRelease)), "agents contract metric omits its observed release");
      assert.ok(candidate.cardMetrics.find((item) => item.label === "活动规则")?.value.startsWith(panelSnapshot.authority.releaseId), "agents live release metric is not panelSnapshot-derived");
      assert.ok(candidate.cardStatus.includes(panelSnapshot.authority.releaseId) && candidate.cardStatus.includes(`${observedRelease} 观察`), "agents status assigns an older Owner regression to the live release");
    }
    const canonicalFacts = JSON.stringify({ heroFacts: candidate.heroFacts, currentState: candidate.currentState, components: candidate.components, methodCanvas: candidate.methodCanvas, modules: candidateModules, liveSnapshot: candidate === project ? panelSnapshot : undefined });
    for (const metric of candidate.cardMetrics) {
      const tokens = metric.value.match(/(?:[Ev]\d+(?:\.\d+)+|\d+(?:\.\d+)?(?:\/\d+)?)/g) || [];
      assert.ok(tokens.length >= 1, `${candidate.slug}/${metric.label} has no traceable value token`);
      for (const token of tokens) {
        const alternate = /^\d$/.test(token) ? digitWords[token] : null;
        assert.ok(canonicalFacts.includes(token) || (alternate && canonicalFacts.includes(alternate)), `${candidate.slug}/${metric.label} is not traceable to canonical project facts`);
      }
    }
  }
  for (const entry of packages) {
    const { project: candidate, modules: candidateModules } = entry;
    assert.equal(candidate.slug, entry.expectedSlug);
    assert.equal(candidate.order, entry.expectedOrder);
    assert.ok(["pass", "problem", "unknown", "mixed"].includes(candidate.statusTone), `${candidate.slug}.statusTone is invalid`);
    for (const key of ["summary", "why", "plainExample", "result"]) {
      assert.equal(typeof candidate[key], "string", `${candidate.slug}.${key} is missing`);
      assert.notEqual(candidate[key].trim(), "", `${candidate.slug}.${key} is empty`);
    }
    assert.ok(Array.isArray(candidate.productPrinciples) && candidate.productPrinciples.length >= 6, `${candidate.slug} lacks a real product-principles layer`);
    assert.equal(new Set(candidate.productPrinciples.map((item) => item.title)).size, candidate.productPrinciples.length, `${candidate.slug} repeats product-principle titles`);
    for (const principle of candidate.productPrinciples) {
      assert.ok(principle.title?.trim() && principle.detail?.trim(), `${candidate.slug} has an empty product principle`);
    }
    const readerLayer = JSON.stringify({ summary: candidate.summary, why: candidate.why, example: candidate.plainExample, result: candidate.result, principles: candidate.productPrinciples, usage: candidate.usageExamples });
    assert.doesNotMatch(readerLayer, /manual_owner_only|curated_packaging|manual snapshot|人工快照|策展快照|包装内容|网站任务|网页任务/i, `${candidate.slug} leaks internal maintenance language into the product layer`);
    assert.doesNotMatch(candidate.summary, /\b(?:main|ruleset|schema|commit)\s*[=:]|\b\d+\s*项测试|PostgreSQL\s*\d|Grafana\s*\d/i, `${candidate.slug} starts with a technical receipt instead of the product`);
    assertReaderStates(candidate.readerStates, `${candidate.slug} overview`);
    assert.ok(candidateModules.length >= 1, `${candidate.slug} has no modules`);
    if (entry.expectedModules) assert.deepEqual(candidateModules.map((item) => item.slug), entry.expectedModules, `${candidate.slug} module contract drifted`);
    assert.equal(new Set(candidateModules.map((item) => item.slug)).size, candidateModules.length, `${candidate.slug} module slugs are not unique`);
    for (const module of candidateModules) {
      assert.ok(["pass", "problem", "unknown", "mixed"].includes(module.statusTone), `${candidate.slug}/${module.slug}.statusTone is invalid`);
      for (const key of ["value", "why", "example", "result", "problem", "status", "relation"]) {
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

test("PCConfig recovery is one complete replacement and reinstall journey instead of a BIOS riddle", async () => {
  const recovery = pcconfigModules.find((item) => item.slug === "recovery-backup");
  assert.ok(recovery, "PCConfig recovery module is missing");
  assert.equal(recovery.shortTitle, "换机与恢复");
  assert.equal(recovery.title, "换机、重装、备份与恢复");
  assert.equal(pcconfigModules.some((item) => /bios|uefi/i.test(item.slug)), false, "BIOS must remain inside the recovery journey instead of becoming a module");

  const readerText = JSON.stringify({
    value: recovery.value,
    why: recovery.why,
    example: recovery.example,
    result: recovery.result,
    states: recovery.readerStates,
    decisions: recovery.decisionImpact
  });
  for (const term of ["同机重装", "换机", "系统盘故障", "只有 PE", "先认机器和磁盘", "自然启动", "应用内数据可见", "不格式化"]) {
    assert.ok(readerText.includes(term), `PCConfig recovery reader layer omits: ${term}`);
  }

  const technicalText = JSON.stringify({
    implementation: recovery.implementation,
    flow: recovery.flow,
    concepts: recovery.concepts,
    boundaries: recovery.boundaries,
    failures: recovery.failures,
    sources: recovery.sources,
    verification: recovery.verification,
    relation: recovery.relation
  });
  for (const term of [
    "F 是启动/救急 U 盘", "G 是在线 Hot", "H 是人工 Cold", "P0–P7", "PCB revision", "F4b", "F12", "F13b",
    "不自动刷写", "list disk / list volume", "clean", "format", "BCD", "230 个 package", "三个控制面", "17 个恢复锚点",
    "15 个项目路径关系", "26 项 C 盘用户配置", "9 个阶段、53 个现行任务", "17 个启动项", "SecretRef", "重新建立备份"
  ]) {
    assert.ok(technicalText.includes(term), `PCConfig recovery technical layer omits: ${term}`);
  }
  for (const term of ["present_verified", "present_observed", "user_confirmed", "H 冷备", "新机/换板端到端恢复", "PE smoke", "保存后自然重启"]) {
    assert.ok(technicalText.includes(term), `PCConfig recovery evidence boundary omits: ${term}`);
  }

  const expectedAliases = [
    "BIOS", "UEFI", "主板设置", "换机 BIOS", "重装 BIOS", "启动U盘", "WEPE", "WinPE", "Q-Flash Plus", "Windows ISO",
    "驱动导出", "重装后恢复驱动", "C盘用户配置", "换机后恢复项目", "重新登录", "自然启动验收", "present_verified"
  ];
  for (const alias of expectedAliases) assert.ok(recovery.searchAliases.includes(alias), `PCConfig recovery search alias is missing: ${alias}`);
  const naturalQueries = [
    "BIOS和换机重装有什么关系",
    "换主板或重装前 BIOS 要留什么",
    "重装 Windows 后怎么把电脑恢复回来"
  ];
  for (const query of naturalQueries) {
    assert.ok(recovery.searchAliases.includes(query), `PCConfig recovery natural query is missing: ${query}`);
    assert.equal(searchPanel(query)[0]?.href, "/projects/pcconfig/recovery-backup", `PCConfig recovery natural query misroutes: ${query}`);
  }

  const publicText = JSON.stringify({ project: pcconfigProject, modules: pcconfigModules });
  assert.doesNotMatch(publicText, /ready_with_warnings|8 个 backup set|9 个任务、8 个 backup set|稳定投影为版本 5|当前 Registry 为版本 5|当前可读取版本 5|13 个项目/);

  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  assert.equal(registry.projects.find((item) => item.id === "pcconfig").ai_refresh.semantic_revision, 4);
});

test("TimeAudit keeps collectors bounded without blanket-banning useful technical facts", async () => {
  const publicText = JSON.stringify({ project: timeAuditProject, modules: timeAuditModules });
  assertForbiddenTermsAreAbsent(publicText);
  assert.ok(timeAuditModules.length >= 1, "the gallery must not replace the project module reference package");
  for (const key of ["responsibilities", "exclusions", "glossary", "operatingFlow", "components", "usageExamples", "evidenceLayers", "evolution", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(timeAuditProject[key]) && timeAuditProject[key].length >= 3, `TimeAudit overview ${key} is incomplete`);
  }
  assert.match(publicText, /聚合/);
  assert.match(publicText, /字段类型不自动保密|字段类型不构成 blanket ban/);
  assert.match(publicText, /实际包含个人敏感正文|真正敏感的具体内容/);
  assert.doesNotMatch(publicText, /postgres(?:ql)?:\/\/[^\s"']+|grafana[_-]?(?:password|token)|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i);

  const expectedGalleryFiles = [
    "dashboard-catalog.png",
    "screen-time-focus.png",
    "power-cost.png",
    "hardware-long-term.png",
    "fps-stutter.png",
    "foreground-stutter-analysis.png",
    "foreground-timeline.png",
    "system-pressure.png",
    "resource-usage.png",
    "process-forensics.png",
    "storage-scale.png"
  ];
  assert.ok(Array.isArray(timeAuditProject.gallery));
  assert.equal(timeAuditProject.gallery.length, expectedGalleryFiles.length);
  assert.deepEqual(timeAuditProject.gallery.map((item) => path.posix.basename(item.src)), expectedGalleryFiles);
  for (const item of timeAuditProject.gallery) {
    assert.match(item.src, /^\/media\/timeaudit\/[a-z0-9-]+\.png$/);
    assert.equal(item.thumbnail, `/media/timeaudit/thumbs/${path.posix.basename(item.src, ".png")}.webp`);
    assert.ok(item.alt?.trim().length >= 8, `${item.src} alt is missing`);
    assert.ok(item.caption?.trim().length >= 12, `${item.src} caption is missing`);
    for (const key of ["evidenceLevel", "evidenceLabel", "observedAt", "sourceCommit", "proves", "doesNotProve"]) assert.ok(item[key]?.trim().length >= 2, `${item.src} ${key} is missing`);
  }

  const mediaRoot = path.join(projectRoot, "public", "media", "timeaudit");
  const mediaFiles = (await readdir(mediaRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(mediaFiles, [...expectedGalleryFiles].sort(), "TimeAudit media directory must contain only the registered PNGs");
  let totalBytes = 0;
  for (const file of mediaFiles) {
    const bytes = (await stat(path.join(mediaRoot, file))).size;
    assert.ok(bytes < 2 * 1024 * 1024, `${file} exceeds the 2 MiB per-image budget`);
    totalBytes += bytes;
  }
  assert.ok(totalBytes <= 8 * 1024 * 1024, `TimeAudit gallery ${totalBytes} bytes exceeds the 8 MiB budget`);

  const thumbnailRoot = path.join(mediaRoot, "thumbs");
  const thumbnailFiles = (await readdir(thumbnailRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(thumbnailFiles, expectedGalleryFiles.map((file) => file.replace(/\.png$/, ".webp")).sort(), "each full image must have one derived preview");
  let thumbnailBytes = 0;
  for (const file of thumbnailFiles) {
    const bytes = (await stat(path.join(thumbnailRoot, file))).size;
    assert.ok(bytes < 100 * 1024, `${file} exceeds the 100 KiB preview budget`);
    thumbnailBytes += bytes;
  }
  assert.ok(thumbnailBytes <= 512 * 1024, `TimeAudit previews ${thumbnailBytes} bytes exceed the 512 KiB budget`);
  assert.ok(totalBytes + thumbnailBytes <= 9 * 1024 * 1024, "full images and their consumed previews exceed the 9 MiB media budget");

  const distMediaRoot = path.join(projectRoot, "dist", "media", "timeaudit");
  const distMediaFiles = (await readdir(distMediaRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(distMediaFiles, mediaFiles, "production media must be the same bounded gallery without generated duplicates");
  for (const file of mediaFiles) {
    assert.equal((await stat(path.join(distMediaRoot, file))).size, (await stat(path.join(mediaRoot, file))).size, `${file} was rewritten or duplicated during build`);
  }
  const distThumbnailRoot = path.join(distMediaRoot, "thumbs");
  const distThumbnailFiles = (await readdir(distThumbnailRoot)).sort();
  assert.deepEqual(distThumbnailFiles, thumbnailFiles, "production previews must match the source preview set");
  for (const file of thumbnailFiles) {
    assert.equal((await stat(path.join(distThumbnailRoot, file))).size, (await stat(path.join(thumbnailRoot, file))).size, `${file} preview changed during build`);
  }

  const assetsRoot = path.join(projectRoot, "dist", "assets");
  for (const javascript of (await readdir(assetsRoot)).filter((item) => item.endsWith(".js"))) {
    const source = await readFile(path.join(assetsRoot, javascript), "utf8");
    assert.doesNotMatch(source, /data:image\/png;base64/i, `${javascript} inlines TimeAudit PNGs into JavaScript`);
  }
});

test("PC Panel Hub keeps software demos, full images and previews bounded and evidence-labelled", async () => {
  const publicText = JSON.stringify({ project: pcPanelHubProject, modules: pcPanelHubModules });
  assertNoCredentialValues(publicText);
  for (const key of ["responsibilities", "exclusions", "glossary", "operatingFlow", "components", "usageExamples", "evidenceLayers", "evolution", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(pcPanelHubProject[key]) && pcPanelHubProject[key].length >= 3, `PC Panel Hub overview ${key} is incomplete`);
  }
  const heroText = pcPanelHubProject.heroFacts.map((item) => item.value).join("\n");
  for (const fact of ["480×1920", "2288×1048", "1 Hz", "command 200", "command 204", "ebbc1f2"]) {
    assert.ok(heroText.includes(fact), `PC Panel Hub first viewport hides ${fact}`);
  }
  assert.match(publicText, /软件(?:设计|演示)|demo/);
  assert.match(publicText, /不是实体屏|不证明实体|不能代替实体|Physical/);
  assert.match(publicText, /具体值实际含|按字段类别自动隐藏/);
  assert.match(publicText, /% Processor Utility/);
  assert.match(publicText, /等待游戏帧/);
  assert.match(publicText, /实体动态壁纸沿用 2026-08-30 本人历史确认/);
  assert.match(publicText, /本轮只确认 Wallpaper Engine 进程与 HS2 浮层落点/);
  assert.match(publicText, /wallpaper64/);
  assert.ok(!pcPanelHubModules.some((item) => item.slug === "acceptance-evidence"));

  const expectedGalleryFiles = [
    "hs2-live-wallpaper-current.jpg",
    "turzx-live-frame-current.png",
    "turzx-renderer-current.png",
    "hs2-max-six-demo.png",
    "hs2-hardware-alert-demo.png",
    "hs2-placement-recovery-design.png"
  ];
  assert.equal(pcPanelHubProject.gallery.length, expectedGalleryFiles.length);
  assert.deepEqual(pcPanelHubProject.gallery.map((item) => path.posix.basename(item.src)), expectedGalleryFiles);
  for (const item of pcPanelHubProject.gallery) {
    assert.match(item.src, /^\/media\/pc-panel-hub\/[a-z0-9-]+\.(?:png|jpg)$/);
    const stem = path.posix.basename(item.src, path.posix.extname(item.src));
    assert.equal(item.thumbnail, `/media/pc-panel-hub/thumbs/${stem}.webp`);
    assert.ok(item.alt?.trim().length >= 8, `${item.src} alt is missing`);
    assert.ok(item.caption?.trim().length >= 20, `${item.src} caption is missing`);
    assert.match(item.caption, /软件|设计|demo|不是|不证明/, `${item.src} does not disclose its evidence level`);
    assert.match(item.evidenceLevel, /^E\d$/);
    assert.ok(item.evidenceLabel?.length >= 4);
    assert.ok(item.proves?.length >= 20);
    assert.ok(item.doesNotProve?.length >= 20);
    assert.match(item.sourceCommit, /^[a-f0-9]{40}$/);
  }

  const mediaRoot = path.join(projectRoot, "public", "media", "pc-panel-hub");
  const mediaFiles = (await readdir(mediaRoot, { withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  assert.deepEqual(mediaFiles, [...expectedGalleryFiles].sort(), "PC Panel Hub media directory must contain only registered PNGs");
  let totalBytes = 0;
  for (const file of mediaFiles) {
    const bytes = (await stat(path.join(mediaRoot, file))).size;
    assert.ok(bytes < 1.5 * 1024 * 1024, `${file} exceeds the 1.5 MiB per-image review threshold`);
    totalBytes += bytes;
  }
  assert.ok(totalBytes <= 3.5 * 1024 * 1024, `PC Panel Hub full images ${totalBytes} bytes exceed the 3.5 MiB review threshold`);

  const thumbnailRoot = path.join(mediaRoot, "thumbs");
  const thumbnailFiles = (await readdir(thumbnailRoot, { withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  assert.deepEqual(thumbnailFiles, expectedGalleryFiles.map((file) => file.replace(/\.(?:png|jpg)$/, ".webp")).sort(), "each PC Panel Hub image must have one WebP preview");
  let thumbnailBytes = 0;
  for (const file of thumbnailFiles) {
    const bytes = (await stat(path.join(thumbnailRoot, file))).size;
    assert.ok(bytes < 100 * 1024, `${file} exceeds the 100 KiB preview threshold`);
    thumbnailBytes += bytes;
  }
  assert.ok(thumbnailBytes <= 512 * 1024, `PC Panel Hub previews ${thumbnailBytes} bytes exceed the 512 KiB review threshold`);
  assert.ok(totalBytes + thumbnailBytes <= 4 * 1024 * 1024, "PC Panel Hub full images and previews exceed the 4 MiB media review threshold");

  const distMediaRoot = path.join(projectRoot, "dist", "media", "pc-panel-hub");
  const distMediaFiles = (await readdir(distMediaRoot, { withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  assert.deepEqual(distMediaFiles, mediaFiles, "production PC Panel Hub media must match source media");
  for (const file of mediaFiles) assert.equal((await stat(path.join(distMediaRoot, file))).size, (await stat(path.join(mediaRoot, file))).size, `${file} changed during build`);
  const distThumbnailFiles = (await readdir(path.join(distMediaRoot, "thumbs"))).sort();
  assert.deepEqual(distThumbnailFiles, thumbnailFiles, "production PC Panel Hub previews must match source previews");
  for (const file of thumbnailFiles) assert.equal((await stat(path.join(distMediaRoot, "thumbs", file))).size, (await stat(path.join(thumbnailRoot, file))).size, `${file} preview changed during build`);

  const assetsRoot = path.join(projectRoot, "dist", "assets");
  for (const javascript of (await readdir(assetsRoot)).filter((item) => item.endsWith(".js"))) {
    assert.doesNotMatch(await readFile(path.join(assetsRoot, javascript), "utf8"), /data:image\/(?:png|jpeg);base64/i, `${javascript} inlines PC Panel Hub full images`);
  }
});

test("the reusable project gallery supports bounded zoom, reset and scrollable detail viewing", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(pageSource, /const \[zoom, setZoom\] = useState\(1\)/);
  assert.match(pageSource, /Math\.min\(4, Math\.max\(1,/);
  assert.match(pageSource, /aria-label="放大大图"/);
  assert.match(pageSource, /aria-label="缩小大图"/);
  assert.match(pageSource, /aria-label="恢复适合窗口大小"/);
  assert.match(pageSource, /project-lightbox-viewport/);
  assert.match(pageSource, /event\.key === "0"/);
  assert.match(pageSource, /image\.naturalWidth/);
  assert.match(pageSource, /ResizeObserver/);
  assert.match(pageSource, /!event\.ctrlKey && !event\.metaKey && !event\.altKey/);
  assert.match(pageSource, /aria-labelledby="project-lightbox-title"/);
  assert.match(pageSource, /project-lightbox-viewport[\s\S]*?tabIndex="0"/);
  assert.match(pageSource, /zoomRef\.current > 1 && viewportRef\.current\?\.contains\(document\.activeElement\)/);
  assert.match(styleSource, /\.project-lightbox-viewport[\s\S]*?overflow: auto/);
  assert.match(styleSource, /\.project-lightbox-image-canvas/);
});

test("PC Panel Hub registry binds future material refreshes without device-side collectors", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "pc-panel-hub");
  assert.ok(registration);
  assert.equal(registration.order, 6);
  assert.equal(registration.route, "/projects/pc-panel-hub");
  assert.equal(registration.ai_refresh.content_path, "app/content-pc-panel-hub.js");
  assert.equal(registration.source.repo, "wlyaaaaa/PC-Panel-Hub");
  assert.equal(registration.source.visibility, "PUBLIC");
  const routineCollectors = registration.ai_refresh.collectors.join("\n");
  assert.match(routineCollectors, /Get-ProjectAdmission\.ps1[\s\S]*PC-Panel-Hub/);
  assert.match(routineCollectors, /check-runtime\.ps1/);
  assert.match(routineCollectors, /stream-heartbeat/);
  assert.doesNotMatch(routineCollectors, /repair-panel|install-startup|StartSideScreen|TestVideoStream|SetSecondaryScreen|Restart-Service/i, "routine website collectors must stay read-only and device-free");
  assert.deepEqual(registration.ai_refresh.collector_requirements.map((item) => item.id), ["pc-panel-hub-task-definitions"]);
  assert.deepEqual(registration.ai_refresh.collector_requirements[0].required_principals, ["SYSTEM", "Administrator"]);
  assert.equal(registration.ai_refresh.collector_requirements[0].required_evidence.complete_visibility, true);
  assert.match(JSON.stringify(registration.refresh_rules.semantic_review_required_when), /transport|physical|display|recovery|verification/i);
  assert.match(JSON.stringify(registration.refresh_rules.ignore_when), /preview|log|heartbeat|runtime artifacts/i);
});

test("CACB explains the product without publishing tested-configuration output", async () => {
  const publicText = JSON.stringify({ project: cacbProject, modules: cacbModules });
  assertNoCredentialValues(publicText);
  assert.doesNotMatch(publicText, /排行榜|排名|名次|分数|\bscore\b|ranking|leaderboard|退役|retir/i);
  for (const entry of [cacbProject, ...cacbModules]) {
    for (const key of ["testedConfigurations", "testedModels", "rankings", "scores", "comparisons", "leaderboard", "results"]) {
      assert.equal(Object.hasOwn(entry, key), false, `CACB public package exposes forbidden result field: ${key}`);
    }
  }
  for (const key of ["responsibilities", "exclusions", "glossary", "operatingFlow", "components", "usageExamples", "evidenceLayers", "evolution", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(cacbProject[key]) && cacbProject[key].length >= 3, `CACB overview ${key} is incomplete`);
  }
  const heroText = cacbProject.heroFacts.map((item) => item.value).join("\n");
  for (const fact of ["47", "25", "59", "59b0b5c", "CI", "lint"]) assert.ok(heroText.includes(fact), `CACB first viewport hides ${fact}`);
  assert.doesNotMatch(publicText, /manual_owner_only|curated_packaging|manual snapshot|人工快照|策展|包装内容/i, "CACB public content must not expose website-maintenance labels");
  assert.equal(cacbModules.length, 5);
  for (const module of cacbModules) assert.match(module.verification.join("\n"), /e6f7581.*历史.*不继承.*当前/, `${module.slug} upgrades historical focused tests to current evidence`);
  assert.match(publicText, /当前提交没有一份绿色 CI/);
  assert.match(publicText, /旧提交的 focused\/full 记录继承为当前可验证/);
  assert.match(publicText, /不发布受测配置结果/);

  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "cacb");
  assert.equal(registration.presentation_mode, "curated_packaging");
  assert.equal(registration.ai_refresh.mode, "manual_owner_only");
  assert.equal(registration.ai_refresh.automatic_handoff, false);
  assert.deepEqual(registration.impact_sources, []);
  assert.equal(registration.source.visibility, "PRIVATE");
  assert.equal(registration.source.repo, "PRIVATE_MANAGED_SOURCE");
  assert.equal(Object.hasOwn(registration.source, "local_root"), false);
});

test("the learning project restores the AI-assisted method without topics, progress or supervision", async () => {
  const publicText = JSON.stringify({ project: learningProject, modules: learningModules });
  assertNoCredentialValues(publicText);
  assert.doesNotMatch(publicText, /求职|简历|薪资|Offer|面试|第\s*0?[1-9]\s*篇|已读|待阅读|当前第|完成率|讲义索引|\bRAG\b|Prompt|Context|Schema/iu);
  assert.equal(learningProject.slug, "learning");
  assert.equal(learningProject.order, 8);
  assert.equal(learningProject.route, "/projects/learning");
  assert.equal(learningProject.visibility, "私有仓库");
  assert.equal(learningProject.gallery, undefined);
  assert.equal(learningModules.length, 5);
  assert.deepEqual(learningModules.map((item) => item.slug), ["authoritative-research", "plain-language", "dialogue-revision", "questions-validation", "human-control-simple"]);
  assert.equal(learningProject.methodCanvas.steps.length, 6);
  assert.ok(learningProject.methodCanvas.humanRole.length >= 3);
  assert.ok(learningProject.methodCanvas.aiRole.length >= 3);
  assert.ok(learningProject.methodCanvas.absentByDesign.length >= 3);
  assert.ok(learningProject.methodCanvas.thinkingQuestions.length >= 5);
  assert.match(publicText, /权威资料|一手来源/);
  assert.match(publicText, /继续交流|重新搜索|重新查证|补查/);
  assert.match(publicText, /人.*决定|人类最终决定/);
  assert.match(publicText, /不计分/);
  assert.match(publicText, /小注意力/);
  assert.match(publicText, /不监督|没有.*监督/);
  assert.match(publicText, /完整可读.*成品/);
  assert.match(publicText, /一次只推进一个单元/);
  assert.match(publicText, /没有.*应用代码.*自动化测试/);
  assert.match(publicText, /没有应用服务、学习数据库、提醒任务、后台同步/);
  assert.match(publicText, /示例可以设计，结果不能编/);
  assert.match(publicText, /不能.*普遍有效|不构成.*普遍有效/);
  for (const module of learningModules) {
    assert.ok(module.searchAliases.length >= 3, `${module.slug} lacks public-safe natural search aliases`);
    assert.ok(module.sources.every((item) => /^https:\/\//.test(item.href)), `${module.slug} contains a non-public research reference`);
  }

  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "learning");
  assert.equal(registration.presentation_mode, "curated_packaging");
  assert.equal(registration.ai_refresh.mode, "manual_owner_only");
  assert.equal(registration.ai_refresh.automatic_handoff, false);
  assert.deepEqual(registration.impact_sources, []);
  assert.equal(registration.source.visibility, "PRIVATE");
  assert.equal(registration.source.repo, "PRIVATE_MANAGED_SOURCE");
  assert.equal(Object.hasOwn(registration.source, "local_root"), false);
  assert.match(registration.ai_refresh.scope, /without exposing any learning subject or progress/);
  assert.match(registration.refresh_rules.ignore_when.join("\n"), /topic and progress changes/);
});

test("PC Panel Hub, CACB and learning expose complete journeys through bounded module search semantics", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const packages = [
    { project: pcPanelHubProject, modules: pcPanelHubModules },
    { project: cacbProject, modules: cacbModules },
    { project: learningProject, modules: learningModules }
  ];
  assert.equal(packages.flatMap((entry) => entry.modules).length, 15);

  for (const { project, modules } of packages) {
    assert.equal(registry.projects.find((item) => item.id === project.slug).ai_refresh.semantic_revision, 3, `${project.slug} semantic revision did not advance`);
    const moduleSlugs = new Set(modules.map((module) => module.slug));
    for (const usage of project.usageExamples) {
      assert.ok(moduleSlugs.has(usage.moduleSlug), `${project.slug} usage is not routed to a real module: ${usage.ask}`);
    }
    for (const module of modules) {
      assert.ok(project.usageExamples.some((usage) => usage.moduleSlug === module.slug), `${project.slug}/${module.slug} has no natural usage journey`);
      assert.ok(module.searchAliases.length >= 4 && module.searchAliases.length <= 8, `${project.slug}/${module.slug} search aliases are not bounded`);
      assert.equal(new Set(module.searchAliases).size, module.searchAliases.length, `${project.slug}/${module.slug} repeats a search alias`);
      assert.deepEqual(Object.keys(module.searchProjection).sort(), ["entities", "failureRecovery", "intents", "relations"]);
      for (const [field, values] of Object.entries(module.searchProjection)) {
        assert.ok(values.length >= 3 && values.length <= 8, `${project.slug}/${module.slug} ${field} is not bounded`);
        assert.ok(values.every((value) => typeof value === "string" && value.trim().length >= 2), `${project.slug}/${module.slug} ${field} contains an empty search phrase`);
        assert.equal(new Set(values).size, values.length, `${project.slug}/${module.slug} repeats a ${field} phrase`);
      }
    }
  }

  const expectedNaturalRoutes = [
    [pcPanelHubProject, "A108 或显示端点不见了，物理接线怎么恢复？", "power-recovery"],
    [cacbProject, "某个模型现在到底能不能在这个 harness 里用？", "identity-evidence"],
    [cacbProject, "官方价格和本地实测成本为什么要分开？", "failure-reporting"],
    [cacbProject, "缺失外部证据能不能填 0？", "failure-reporting"],
    [learningProject, "先给我完整讲义再聊", "plain-language"],
    [learningProject, "后来发现讲义错了要不要告诉我", "dialogue-revision"],
    [learningProject, "我没反馈别生成下一篇", "human-control-simple"]
  ];
  for (const [project, query, moduleSlug] of expectedNaturalRoutes) {
    assert.equal(project.usageExamples.find((usage) => usage.ask === query)?.moduleSlug, moduleSlug, `${query} does not expose its expected module route`);
  }

  const panelRecovery = JSON.stringify(pcPanelHubModules.find((module) => module.slug === "power-recovery"));
  for (const pattern of [/关机.*断开整机电源/, /USB 2\.0 9-pin/, /EDGE HUB/, /一分二 Hub.*不支持 LCD/, /SATA/, /唯一 8091.*port 2 controller.*port 3 LED.*连续两次/, /source contract.*未.*实测|源码.*没有实际.*实体恢复/]) {
    assert.match(panelRecovery, pattern, `PC Panel Hub physical recovery journey is incomplete: ${pattern}`);
  }

  const cacbJudgment = JSON.stringify({ project: cacbProject, failureReporting: cacbModules.find((module) => module.slug === "failure-reporting") });
  assert.match(cacbJudgment, /官方能力.*可用性.*价格/);
  assert.match(cacbJudgment, /本地 Codex.*真实/);
  assert.match(cacbJudgment, /资格.*能力.*经济性.*路由建议/);
  assert.match(cacbJudgment, /model evidence card.*benchmark report.*comprehensive judgment report/);
  assert.match(cacbJudgment, /缺失.*不归零|缺项.*不填零/);

  const learningJourney = JSON.stringify({ project: learningProject, dialogueRevision: learningModules.find((module) => module.slug === "dialogue-revision") });
  assert.match(learningJourney, /核验.*反查.*反例.*自审/);
  assert.match(learningJourney, /完整讲义.*最终版/);
  assert.match(learningJourney, /重要修正.*主动/);
  assert.match(learningJourney, /不能.*假设.*重读|不假设.*重读/);
});

test("the learning method canvas stays human-readable, static and responsive", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(pageSource, /function MethodCanvas\(\{ canvas, kind \}\)/);
  assert.doesNotMatch(pageSource, /\["AI", "人工智能"\]/, "AI is a common abbreviation and must not receive a mechanical parenthetical gloss");
  assert.match(pageSource, /if \(kind === "learning"\) return value/);
  assert.match(pageSource, /if \(kind === "codex-remote"\) return annotateCodexRemoteTerms\(value\)/);
  assert.match(pageSource, /你、AI与刻意不建设的边界/);
  assert.match(pageSource, /问题不计分，也不会形成掌握记录/);
  assert.match(pageSource, /entry\.kind === "learning"/);
  assert.doesNotMatch(pageSource, /公开范围：方法与边界，不含主题或进度/);
  assert.match(pageSource, /source\.href \? <a className="source-reference-link"/);
  assert.match(styleSource, /\.method-step-flow\s*\{[\s\S]*?grid-template-columns:\s*repeat\(6,/);
  assert.match(styleSource, /@media \(max-width: 680px\)[\s\S]*?\.method-step-flow,[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(styleSource, /\.project-quick-state\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,/);

  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "learning", "index.html"), "utf8");
  assert.match(overviewHtml, /data-static-route="\/projects\/learning"/);
  assert.match(overviewHtml, /class="method-canvas document-section"/);
  for (const text of ["提出真正的问题", "找到该信谁", "把复杂内容讲明白", "继续交流", "补查、修正或验证", "决定继续还是停"]) {
    assert.ok(overviewHtml.includes(text), `static learning method canvas omits: ${text}`);
  }
  for (const text of ["你", "AI", "刻意没有", "问题不计分，也不会形成掌握记录"]) {
    assert.ok(overviewHtml.includes(text), `static learning role canvas omits: ${text}`);
  }
  assert.doesNotMatch(overviewHtml, /求职|简历|薪资|Offer|面试|第\s*0?[1-9]\s*篇|已读|待阅读|当前第|完成率|讲义索引/iu);
  assert.doesNotMatch(overviewHtml, new RegExp("AI" + "（人工智能）"), "learning copy must not mechanically gloss the common AI term on every card");
  const sourceHtml = await readFile(path.join(projectRoot, "dist", "projects", "learning", "authoritative-research", "index.html"), "utf8");
  assert.match(sourceHtml, /href="https:\/\/www\.ala\.org\/acrl\/standards\/ilframework"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  assert.match(sourceHtml, /href="https:\/\/doi\.org\/10\.6028\/NIST\.AI\.600-1"/);
});

test("Codex Remote is a manual-only public product with valuable real and synthetic visual evidence", async () => {
  const publicText = JSON.stringify({ project: codexRemoteProject, modules: codexRemoteModules });
  assertNoCredentialValues(publicText);
  assert.doesNotMatch(publicText, /退役|不稳定|wly\.tailbe/i);
  assert.doesNotMatch(publicText, /sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i);
  assert.match(publicText, /同一个 Codex Desktop 任务/);
  assert.match(publicText, /不是远程桌面/);
  assert.match(publicText, /v0\.1\.5/);
  assert.match(publicText, /c3a07719/);
  assert.match(publicText, /1771/);
  assert.match(publicText, /main=94f1cfad/);
  assert.match(publicText, /不代表当前在线|不宣称在线/);
  assert.match(publicText, /历史真实链路与产品证据已形成，本轮未完成当前Windows接管方案的可重复无人值守验收；重新启用前需隔离验证/);
  assert.match(publicText, /12 张历史真实手机 UI|12张真实手机 UI/);
  assert.equal(codexRemoteProject.slug, "codex-remote");
  assert.equal(codexRemoteProject.order, 9);
  assert.equal(codexRemoteProject.route, "/projects/codex-remote");
  assert.equal(codexRemoteProject.visibility, "公开仓库");
  assert.equal(codexRemoteModules.length, 7);
  assert.deepEqual(codexRemoteModules.map((item) => item.slug), ["same-task-control", "conversation-control", "models-approvals-context", "projects-files-input", "shared-realtime-architecture", "security-public-access", "versions-evidence"]);
  for (const module of codexRemoteModules) {
    assert.ok(module.searchAliases.length >= 4, `${module.slug} lacks natural search aliases`);
    assert.deepEqual(Object.keys(module.searchProjection), ["intents", "entities", "relations", "failureRecovery"], `${module.slug} search projection shape drifted`);
    for (const [key, values] of Object.entries(module.searchProjection)) {
      assert.ok(Array.isArray(values) && values.length >= 3 && values.length <= 8, `${module.slug}.${key} search projection is not bounded`);
      assert.equal(new Set(values).size, values.length, `${module.slug}.${key} search projection repeats an entry`);
      assert.ok(values.every((value) => typeof value === "string" && value.trim().length >= 3 && value.length <= 140), `${module.slug}.${key} search projection contains an invalid entry`);
    }
    assert.ok(module.sources.every((item) => /^https:\/\/github\.com\/wlyaaaaa\/codex-local-remote\//.test(item.href)), `${module.slug} contains a non-public source link`);
    assert.ok(module.relation.trim().length >= 24, `${module.slug} lacks a useful cross-module relation`);
  }
  const remoteModuleSlugs = new Set(codexRemoteModules.map((item) => item.slug));
  assert.ok(codexRemoteProject.usageExamples.every((item) => remoteModuleSlugs.has(item.moduleSlug)), "a Codex Remote usage example has no owning moduleSlug");
  assert.deepEqual(new Set(codexRemoteProject.usageExamples.map((item) => item.moduleSlug)), remoteModuleSlugs, "Codex Remote usage examples do not cover all seven module journeys");
  const conversationControl = codexRemoteModules.find((item) => item.slug === "conversation-control");
  const conversationText = JSON.stringify(conversationControl);
  for (const term of ["threadId", "turnId", "availableActions", "text", "queue revision", "clientUserMessageId", "连接状态", "next-turn settings", "steer", "interrupt", "FIFO", "DPAPI", "authority snapshot", "ambiguous"]) {
    assert.ok(conversationText.includes(term), `conversation-control omits ${term}`);
  }
  for (const expected of [
    /当前轮.*steer.*interrupt.*下一轮.*队列/s,
    /先.*持久化.*再确认/s,
    /编辑.*排序.*删除/s,
    /正常终态.*派发|终态后.*派发/s,
    /权威.*快照.*对账|authority snapshot.*对账/s,
    /ambiguous.*停止自动重放|ambiguous.*停止自动重发/s
  ]) assert.match(conversationText, expected, `conversation-control omits state-machine journey: ${expected}`);

  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "codex-remote");
  assert.equal(registration.presentation_mode, "curated_packaging");
  assert.equal(registration.ai_refresh.mode, "manual_owner_only");
  assert.equal(registration.ai_refresh.automatic_handoff, false);
  assert.deepEqual(registration.impact_sources, []);
  assert.equal(registration.source.visibility, "PUBLIC");
  assert.equal(registration.source.repo, "wlyaaaaa/codex-local-remote");
  assert.equal(registration.ai_refresh.semantic_revision, 3);
  assert.match(registration.ai_refresh.scope, /seven modules/);
  assert.equal(Object.hasOwn(registration.source, "local_root"), false);
  assert.match(registration.ai_refresh.scope, /without invoking any Remote runtime/);
  assert.match(registration.ai_refresh.collectors.join("\n"), /never invoke a dispatcher, scheduled task, Broker, Sidecar, app-server/);

  assert.ok(Array.isArray(codexRemoteProject.gallery));
  assert.ok(codexRemoteProject.gallery.some((item) => item.evidenceLevel === "E3"), "gallery lacks real mobile evidence");
  assert.ok(codexRemoteProject.gallery.some((item) => item.evidenceLevel === "E1"), "gallery lacks public-safe UI evidence");
  assert.equal(new Set(codexRemoteProject.gallery.map((item) => item.caption)).size, codexRemoteProject.gallery.length, "gallery contains repeated captions instead of distinct visual value");
  assert.equal(new Set(codexRemoteProject.gallery.map((item) => `${item.proves}|${item.doesNotProve}`)).size, codexRemoteProject.gallery.length, "gallery contains repeated evidence claims instead of distinct value");
  const mediaRoot = path.join(projectRoot, "public", "media", "codex-remote");
  const thumbnailRoot = path.join(mediaRoot, "thumbs");
  const mediaFiles = (await readdir(mediaRoot, { withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  const thumbnailFiles = (await readdir(thumbnailRoot, { withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  const expectedMedia = codexRemoteProject.gallery.map((item) => path.posix.basename(item.src)).sort();
  const expectedThumbnails = codexRemoteProject.gallery.map((item) => path.posix.basename(item.thumbnail)).sort();
  assert.deepEqual(mediaFiles, expectedMedia, "Codex Remote media directory contains unregistered or missing full images");
  assert.deepEqual(thumbnailFiles, expectedThumbnails, "Codex Remote preview set does not close over the gallery");
  const fullHashes = [];
  let fullBytes = 0;
  let thumbnailBytes = 0;
  for (const item of codexRemoteProject.gallery) {
    assert.match(item.src, /^\/media\/codex-remote\/[a-z0-9-]+\.(?:jpg|png)$/);
    assert.match(item.thumbnail, /^\/media\/codex-remote\/thumbs\/[a-z0-9-]+\.webp$/);
    for (const key of ["alt", "caption", "evidenceLevel", "evidenceLabel", "proves", "doesNotProve", "observedAt", "sourceCommit"]) {
      assert.ok(item[key]?.trim().length >= 2, `${item.src} lacks ${key}`);
    }
    const full = await readFile(path.join(projectRoot, "public", item.src.slice(1)));
    const preview = await readFile(path.join(projectRoot, "public", item.thumbnail.slice(1)));
    assert.ok(full.length < 1.5 * 1024 * 1024, `${item.src} exceeds the per-image review threshold`);
    assert.ok(preview.length < 96 * 1024, `${item.thumbnail} exceeds the preview review threshold`);
    fullBytes += full.length;
    thumbnailBytes += preview.length;
    fullHashes.push(createHash("sha256").update(full).digest("hex"));
  }
  assert.equal(new Set(fullHashes).size, fullHashes.length, "Codex Remote gallery contains duplicate full images");
  assert.ok(fullBytes <= 4 * 1024 * 1024, `Codex Remote full images ${fullBytes} bytes exceed the 4 MiB review threshold`);
  assert.ok(thumbnailBytes <= 1024 * 1024, `Codex Remote previews ${thumbnailBytes} bytes exceed the 1 MiB review threshold`);
  assert.ok(fullBytes + thumbnailBytes <= 5 * 1024 * 1024, "Codex Remote gallery exceeds the combined media review threshold");

  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "codex-remote", "index.html"), "utf8");
  assert.match(overviewHtml, /data-static-route="\/projects\/codex-remote"/);
  assert.match(overviewHtml, /Codex Remote/);
  assert.match(overviewHtml, /不代表当前在线|不宣称在线/);
  assert.match(overviewHtml, /href="https:\/\/github\.com\/wlyaaaaa\/codex-local-remote"/);
  assert.match(overviewHtml, /20 张界面证据|20张界面证据/);
  assert.doesNotMatch(overviewHtml, /Codex Remote（远端仓库）/, "product identity must not be mechanically annotated into a false generic meaning");
  for (const text of ["app-server（任务协议服务）", "Sidecar（认证侧车服务）", "loopback（本机回环）", "diff（文件差异）"] ) {
    assert.ok(overviewHtml.includes(text), `Codex Remote overview omits immediate technical explanation: ${text}`);
  }
  const securityHtml = await readFile(path.join(projectRoot, "dist", "projects", "codex-remote", "security-public-access", "index.html"), "utf8");
  assert.match(securityHtml, /Origin（请求来源）/);
  assert.doesNotMatch(securityHtml, /Origin（默认远端名称）/);
});

test("personal-health publishes the evidence product without personal health payloads", async () => {
  const publicText = JSON.stringify({ project: personalHealthProject, modules: personalHealthModules });
  assertNoCredentialValues(publicText);
  assert.equal(personalHealthProject.slug, "personal-health");
  assert.equal(personalHealthProject.order, 10);
  assert.equal(personalHealthProject.route, "/projects/personal-health");
  assert.equal(personalHealthProject.visibility, "私有仓库");
  assert.equal(personalHealthProject.statusTone, "mixed");
  assert.equal(personalHealthProject.heroFacts.length, 6);
  assert.equal(personalHealthProject.methodCanvas.steps.length, 6);
  assert.equal(personalHealthProject.methodCanvas.columns.length, 3);
  assert.equal(personalHealthProject.productPrinciples.length, 11);
  assert.equal(personalHealthProject.decisionRoles.length, 5);
  assert.match(personalHealthProject.summary, /AI站在用户一边/);
  assert.ok(personalHealthProject.productPrinciples.some((item) => item.title === "校准信任，不盲从也不敌视"));
  assert.ok(personalHealthProject.productPrinciples.some((item) => item.title === "第二意见用在真正值钱的地方"));
  assert.equal(personalHealthProject.gallery, undefined, "health evidence design must not invent a data gallery");
  assert.deepEqual(personalHealthProject.stateLabels, ["可用于当前判断", "需要复核", "本轮不可用"]);
  assert.deepEqual(personalHealthModules.map((item) => item.slug), ["current-evidence-route", "protected-foreground-refresh", "raw-preservation-resume", "offline-decision-brief", "evidence-three-state", "health-owner-boundary"]);
  for (const module of personalHealthModules) {
    assert.deepEqual(module.stateLabels, personalHealthProject.stateLabels, `${module.slug} does not use the evidence three-state labels`);
    assert.ok(module.searchAliases.length >= 4, `${module.slug} lacks natural search aliases`);
    assert.deepEqual(Object.keys(module.searchProjection), ["intents", "entities", "relations", "failureRecovery"], `${module.slug} search projection shape drifted`);
    for (const [key, values] of Object.entries(module.searchProjection)) {
      assert.ok(Array.isArray(values) && values.length >= 3 && values.length <= 8, `${module.slug}.${key} search projection is not bounded`);
      assert.equal(new Set(values).size, values.length, `${module.slug}.${key} search projection repeats an entry`);
      assert.ok(values.every((value) => typeof value === "string" && value.trim().length >= 3 && value.length <= 140), `${module.slug}.${key} search projection contains an invalid entry`);
    }
    assert.ok(module.sources.every((item) => !item.href || /^https:\/\/(?:www\.ahrq\.gov|www\.who\.int|www\.gmc-uk\.org|code-medical-ethics\.ama-assn\.org|www\.cancer\.gov)\//.test(item.href)), `${module.slug} may link only to reviewed public health authorities, never an inaccessible private source`);
    assert.match(`${module.why}\n${module.example}\n${module.result}`, /证据|来源|判断|未知|凭据|清单|Owner|原件|字段/);
  }
  const healthModuleSlugs = new Set(personalHealthModules.map((item) => item.slug));
  assert.ok(personalHealthProject.usageExamples.every((item) => healthModuleSlugs.has(item.moduleSlug)), "a personal-health usage example has no owning moduleSlug");
  assert.deepEqual(new Set(personalHealthProject.usageExamples.map((item) => item.moduleSlug)), healthModuleSlugs, "personal-health usage examples do not cover all six evidence journeys");
  for (const expected of [
    "112 项全部通过",
    "health_owner_review_required=true",
    "current_updated=false",
    "background_work_created=false",
    "21 类兼容设备字段",
    "默认摘要只读 4 类低噪声字段",
    "没有记录不等于零",
    "不诊断疾病",
    "不建立健康总分",
    "不建立计划任务"
  ]) {
    assert.ok(publicText.includes(expected), `personal-health omits product boundary: ${expected}`);
  }
  assert.doesNotMatch(publicText, /E:\\PersonalData|manifest\.fitbit-air\.json|尿酸|肌酐|心电图|\bBMI\b/iu);
  assert.ok(personalHealthProject.currentState.gaps.some((item) => item.includes("不能证明当前账号仍授权")));
  assert.doesNotMatch(personalHealthProject.currentState.facts.join("\n"), /当前账号已授权|当前设备在线|当前设备同步正常|已经诊断|建议服用/iu);

  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "personal-health");
  assert.equal(registration.presentation_mode, "curated_packaging");
  assert.equal(registration.ai_refresh.mode, "manual_owner_only");
  assert.equal(registration.ai_refresh.automatic_handoff, false);
  assert.deepEqual(registration.impact_sources, []);
  assert.equal(registration.source.visibility, "PRIVATE");
  assert.equal(registration.source.repo, "wlyaaaaa/personal-health");
  assert.equal(registration.ai_refresh.semantic_revision, 3);
  assert.equal(Object.hasOwn(registration.source, "local_root"), false);
  assert.match(registration.ai_refresh.collectors.join("\n"), /never read CURRENT\.md, SOURCES\.md, raw reports, manifests, briefs, provider payloads or credentials/);
  assert.match(registration.ai_refresh.collectors.join("\n"), /never invoke Google, Secret Broker or a device runtime/);
  assert.deepEqual(registration.refresh_rules.automatic_refresh_when, []);
  assert.match(registration.refresh_rules.ignore_when.join("\n"), /any source-side materiality claim/);

  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /currentProject\.kicker \|\| projectKicker/);
  assert.match(pageSource, /function projectCardPresentation\(entry\)/);
  assert.match(pageSource, /entry\.project\.snapshotBoundary \|\| state\.gaps\?\.\[0\]/);
  assert.match(pageSource, /currentProject\.productPrinciples\?\.length/);
  assert.match(pageSource, /labels=\{currentProject\.stateLabels\}/);
  assert.match(pageSource, /canvas\.columns \|\|/);
  assert.match(pageSource, /canvas\.description \|\|/);

  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "personal-health", "index.html"), "utf8");
  assert.match(overviewHtml, /data-static-route="\/projects\/personal-health"/);
  assert.match(overviewHtml, /class="method-canvas document-section"/);
  assert.match(overviewHtml, /健康选择画布/);
  assert.match(overviewHtml, /可用于当前判断/);
  assert.match(overviewHtml, /inventory_only/);
  assert.doesNotMatch(overviewHtml, /project-gallery|href="https:\/\/github\.com\/wlyaaaaa\/personal-health"/);
  const moduleHtml = await readFile(path.join(projectRoot, "dist", "projects", "personal-health", "offline-decision-brief", "index.html"), "utf8");
  assert.match(moduleHtml, /先检查数据是否完整，再只取与问题有关的部分/);
  assert.match(moduleHtml, /没有记录不证明|80% coverage 不表示健康|blocked_fields/);
});

test("the generic project gallery supports click, keyboard navigation and lazy images", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const staticSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  assert.match(pageSource, /function\s+(?:ProjectGallery|Gallery)\s*\(/);
  assert.match(pageSource, /(?:currentProject|project)\.gallery/);
  assert.match(pageSource, /(?:gallery|images)\.map\([\s\S]{0,1400}onClick=/, "gallery images must open on click");
  assert.match(pageSource, /loading="lazy"/);
  assert.match(pageSource, /image\.thumbnail \|\| image\.src/, "gallery cards must use light previews while the dialog keeps the full image");
  assert.match(pageSource, /可视化证据/);
  assert.match(pageSource, /image\.evidenceLevel/);
  assert.match(pageSource, /activeImage\.proves/);
  assert.match(pageSource, /activeImage\.doesNotProve/);
  assert.match(pageSource, /const hasStructuredEvidence = images\.every/);
  assert.ok(timeAuditProject.gallery.every((item) => item.proves && item.doesNotProve), "TimeAudit must use structured visual evidence for every image");
  assert.ok(pcPanelHubProject.gallery.every((item) => item.proves && item.doesNotProve), "PC Panel Hub must exercise structured visual evidence");
  assert.match(pageSource, /role="dialog"/);
  assert.match(pageSource, /aria-modal="true"/);
  assert.match(pageSource, /createPortal\([\s\S]*?document\.body\)/, "lightbox must escape the main stacking context and cover the fixed header");
  assert.match(pageSource, /project-lightbox-close[\s\S]{0,240}关闭<\/button>/);
  assert.match(pageSource, /aria-label="上一张[^"]*"/);
  assert.match(pageSource, /aria-label="下一张[^"]*"/);
  for (const key of ["Escape", "ArrowLeft", "ArrowRight"]) assert.ok(pageSource.includes(`"${key}"`), `gallery keyboard handling misses ${key}`);
  assert.match(pageSource, /event\.key === "Tab"[\s\S]*?event\.shiftKey[\s\S]*?last\?\.focus\(\)/, "lightbox must keep keyboard focus inside the dialog");
  assert.match(pageSource, /addEventListener\("keydown"/);
  assert.match(pageSource, /removeEventListener\("keydown"/);
  assert.match(pageSource, /data-image-orientation=\{imageOrientation\}/);
  assert.match(pageSource, /zoom === 1 \? scaledImageSize\.height/);
  assert.match(staticSource, /dialog\.dataset\.imageOrientation = fitSize\.naturalWidth > fitSize\.naturalHeight/);
  assert.match(staticSource, /zoom === 1 \? height : Math\.max\(fitSize\.viewportHeight, height\)/);
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  assert.match(styleSource, /project-lightbox-dialog\[data-image-orientation="landscape"\][\s\S]*?height:\s*auto/);
  assert.match(styleSource, /project-lightbox-dialog\[data-image-orientation="landscape"\][\s\S]*?max-height:\s*calc\(100svh - 260px\)/);
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
  const timeAuditCandidate = run(["--project", "timeaudit", "--path", "pcconfig_anomaly_digest.py"]);
  const timeAuditMaterial = run(["--project", "timeaudit", "--path", "pcconfig_anomaly_digest.py", "--material-change"]);
  const timeAuditPrivateData = run(["--project", "timeaudit", "--path", "data/raw-telemetry.json", "--material-change"]);
  const timeAuditMainCandidate = run(["--project", "timeaudit", "--path", "main.py"]);
  const timeAuditMainMaterial = run(["--project", "timeaudit", "--path", "main.py", "--material-change"]);
  const timeAuditHeartbeat = run(["--project", "timeaudit", "--path", "log/telemetry_heartbeat", "--material-change"]);
  const timeAuditDashboard = run(["--project", "timeaudit", "--path", "grafana_dashboards/main.json"]);
  const pcPanelCandidate = run(["--project", "pc-panel-hub", "--path", "tools/turzx_side_screen/TURZX.SideScreen.Stream.cs"]);
  const pcPanelMaterial = run(["--project", "pc-panel-hub", "--path", "tools/turzx_side_screen/TURZX.SideScreen.Stream.cs", "--material-change"]);
  const pcPanelHeartbeat = run(["--project", "pc-panel-hub", "--path", "tools/turzx_side_screen/out/stream/stream-heartbeat.json", "--material-change"]);
  const cacbSourceChange = run(["--project", "cacb", "--path", "src/cacb/question_bank.py", "--material-change"]);
  const learningSourceChange = run(["--project", "learning", "--path", "private/method-material.md", "--material-change"]);
  const codexRemoteSourceChange = run(["--project", "codex-remote", "--path", "apps/web/src/App.tsx", "--material-change"]);
  const personalHealthSourceChange = run(["--project", "personal-health", "--path", "google_health_brief.py", "--material-change"]);
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
  assert.equal(timeAuditCandidate.impact_candidate, true);
  assert.equal(timeAuditCandidate.task_required, false);
  assert.equal(timeAuditMaterial.task_required, true);
  assert.equal(timeAuditMaterial.action, "create_fresh_independent_website_project_task_after_source_readback");
  assert.equal(timeAuditPrivateData.impact_candidate, false);
  assert.equal(timeAuditPrivateData.task_required, false);
  assert.equal(timeAuditMainCandidate.impact_candidate, true);
  assert.equal(timeAuditMainCandidate.task_required, false);
  assert.equal(timeAuditMainMaterial.task_required, true);
  assert.equal(timeAuditHeartbeat.impact_candidate, false);
  assert.equal(timeAuditHeartbeat.task_required, false);
  assert.equal(timeAuditHeartbeat.action, "no_website_task");
  assert.equal(timeAuditDashboard.impact_candidate, true);
  assert.equal(timeAuditDashboard.task_required, false);
  assert.equal(pcPanelCandidate.impact_candidate, true);
  assert.equal(pcPanelCandidate.task_required, false);
  assert.equal(pcPanelMaterial.task_required, true);
  assert.equal(pcPanelMaterial.action, "create_fresh_independent_website_project_task_after_source_readback");
  assert.equal(pcPanelHeartbeat.impact_candidate, false);
  assert.equal(pcPanelHeartbeat.task_required, false);
  assert.equal(cacbSourceChange.refresh_mode, "manual_owner_only");
  assert.equal(cacbSourceChange.impact_candidate, false);
  assert.equal(cacbSourceChange.material_change_confirmed, false);
  assert.equal(cacbSourceChange.source_materiality_ignored, true);
  assert.equal(cacbSourceChange.task_required, false);
  assert.equal(cacbSourceChange.action, "manual_owner_request_required_no_automatic_handoff");
  assert.equal(learningSourceChange.refresh_mode, "manual_owner_only");
  assert.equal(learningSourceChange.impact_candidate, false);
  assert.equal(learningSourceChange.material_change_confirmed, false);
  assert.equal(learningSourceChange.source_materiality_ignored, true);
  assert.equal(learningSourceChange.task_required, false);
  assert.equal(learningSourceChange.action, "manual_owner_request_required_no_automatic_handoff");
  assert.equal(codexRemoteSourceChange.refresh_mode, "manual_owner_only");
  assert.equal(codexRemoteSourceChange.impact_candidate, false);
  assert.equal(codexRemoteSourceChange.material_change_confirmed, false);
  assert.equal(codexRemoteSourceChange.source_materiality_ignored, true);
  assert.equal(codexRemoteSourceChange.task_required, false);
  assert.equal(codexRemoteSourceChange.action, "manual_owner_request_required_no_automatic_handoff");
  assert.equal(personalHealthSourceChange.refresh_mode, "manual_owner_only");
  assert.equal(personalHealthSourceChange.impact_candidate, false);
  assert.equal(personalHealthSourceChange.material_change_confirmed, false);
  assert.equal(personalHealthSourceChange.source_materiality_ignored, true);
  assert.equal(personalHealthSourceChange.task_required, false);
  assert.equal(personalHealthSourceChange.action, "manual_owner_request_required_no_automatic_handoff");
});

test("AI refresh planner supports targeted and full refresh without writing narrative content", async () => {
  const script = path.join(projectRoot, "scripts", "prepare-ai-panel-refresh.mjs");
  const contentPaths = ["app/content-core.js", "app/content-pcconfig.js", "app/content-github-index.js", "app/content-chinese-asr.js", "app/content-timeaudit.js", "app/content-pc-panel-hub.js", "app/content-cacb.js", "app/content-learning.js", "app/content-codex-remote.js", "app/content-personal-health.js"];
  const before = await Promise.all(contentPaths.map((item) => readFile(path.join(projectRoot, item), "utf8")));
  const run = (args) => JSON.parse(execFileSync(process.execPath, [script, ...args], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
  const targeted = run(["--project", "pcconfig"]);
  const targetedTimeAudit = run(["--project", "timeaudit"]);
  const targetedPcPanelHub = run(["--project", "pc-panel-hub"]);
  const targetedCacbWithoutOwner = run(["--project", "cacb"]);
  const targetedCacb = run(["--project", "cacb", "--manual-owner-request"]);
  const targetedLearningWithoutOwner = run(["--project", "learning"]);
  const targetedLearning = run(["--project", "learning", "--manual-owner-request"]);
  const targetedCodexRemoteWithoutOwner = run(["--project", "codex-remote"]);
  const targetedCodexRemote = run(["--project", "codex-remote", "--manual-owner-request"]);
  const targetedPersonalHealthWithoutOwner = run(["--project", "personal-health"]);
  const targetedPersonalHealth = run(["--project", "personal-health", "--manual-owner-request"]);
  const fullWithoutOwner = run(["--all"]);
  const full = run(["--all", "--manual-owner-request"]);
  const after = await Promise.all(contentPaths.map((item) => readFile(path.join(projectRoot, item), "utf8")));

  assert.equal(targeted.schema, "wly.ai-panel-refresh-plan.v1");
  assert.equal(targeted.status, "ready_for_ai");
  assert.equal(targeted.mode, "targeted");
  assert.deepEqual(targeted.selected_projects.map((item) => item.id), ["pcconfig"]);
  assert.ok(targeted.selected_projects[0].collectors.some((item) => /SYSTEM\/Administrator[\s\S]*complete_visibility=true/.test(item)));
  assert.deepEqual(targeted.selected_projects[0].collector_requirements.map((item) => item.id), ["pcconfig-task-definitions"]);
  assert.deepEqual(targeted.selected_projects[0].collector_requirements[0].required_principals, ["SYSTEM", "Administrator"]);
  assert.equal(targeted.selected_projects[0].collector_requirements[0].required_evidence.complete_visibility, true);
  assert.match(targeted.selected_projects[0].content_sha256, /^[a-f0-9]{64}$/);
  assert.equal(targeted.selected_projects[0].semantic_revision, 4);
  assert.equal(targeted.selected_projects[0].source_fingerprint, null);
  assert.match(targeted.selected_projects[0].source_fingerprint_state, /fresh Owner evidence/);
  assert.deepEqual(targetedTimeAudit.selected_projects.map((item) => item.id), ["timeaudit"]);
  assert.equal(targetedTimeAudit.selected_projects[0].content_path, "app/content-timeaudit.js");
  assert.equal(targetedTimeAudit.selected_projects[0].semantic_revision, 3);
  assert.match(targetedTimeAudit.selected_projects[0].content_sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(targetedPcPanelHub.selected_projects.map((item) => item.id), ["pc-panel-hub"]);
  assert.equal(targetedPcPanelHub.selected_projects[0].content_path, "app/content-pc-panel-hub.js");
  assert.equal(targetedPcPanelHub.selected_projects[0].semantic_revision, 3);
  assert.match(targetedPcPanelHub.selected_projects[0].content_sha256, /^[a-f0-9]{64}$/);
  assert.equal(targetedCacbWithoutOwner.status, "manual_owner_request_required");
  assert.deepEqual(targetedCacbWithoutOwner.manual_project_ids, ["cacb"]);
  assert.equal(targetedCacbWithoutOwner.selected_projects[0].automatic_handoff, false);
  assert.equal(targetedCacbWithoutOwner.selected_projects[0].manual_owner_request, false);
  assert.equal(targetedCacb.status, "ready_for_ai");
  assert.equal(targetedCacb.manual_owner_request, true);
  assert.equal(targetedCacb.selected_projects[0].refresh_mode, "manual_owner_only");
  assert.equal(targetedCacb.selected_projects[0].manual_owner_request, true);
  assert.deepEqual(targetedCacb.selected_projects[0].impact_sources, []);
  assert.equal(targetedLearningWithoutOwner.status, "manual_owner_request_required");
  assert.deepEqual(targetedLearningWithoutOwner.manual_project_ids, ["learning"]);
  assert.equal(targetedLearningWithoutOwner.selected_projects[0].automatic_handoff, false);
  assert.equal(targetedLearningWithoutOwner.selected_projects[0].manual_owner_request, false);
  assert.equal(targetedLearning.status, "ready_for_ai");
  assert.equal(targetedLearning.manual_owner_request, true);
  assert.equal(targetedLearning.selected_projects[0].refresh_mode, "manual_owner_only");
  assert.equal(targetedLearning.selected_projects[0].manual_owner_request, true);
  assert.deepEqual(targetedLearning.selected_projects[0].impact_sources, []);
  assert.equal(targetedCodexRemoteWithoutOwner.status, "manual_owner_request_required");
  assert.deepEqual(targetedCodexRemoteWithoutOwner.manual_project_ids, ["codex-remote"]);
  assert.equal(targetedCodexRemoteWithoutOwner.selected_projects[0].source.visibility, "PUBLIC");
  assert.equal(targetedCodexRemoteWithoutOwner.selected_projects[0].automatic_handoff, false);
  assert.equal(targetedCodexRemoteWithoutOwner.selected_projects[0].manual_owner_request, false);
  assert.match(targetedCodexRemoteWithoutOwner.selected_projects[0].source_fingerprint_state, /Fresh Owner evidence/);
  assert.doesNotMatch(targetedCodexRemoteWithoutOwner.selected_projects[0].source_fingerprint_state, /private Owner/i);
  assert.equal(targetedCodexRemote.status, "ready_for_ai");
  assert.equal(targetedCodexRemote.manual_owner_request, true);
  assert.equal(targetedCodexRemote.selected_projects[0].refresh_mode, "manual_owner_only");
  assert.equal(targetedCodexRemote.selected_projects[0].manual_owner_request, true);
  assert.deepEqual(targetedCodexRemote.selected_projects[0].impact_sources, []);
  assert.equal(targetedPersonalHealthWithoutOwner.status, "manual_owner_request_required");
  assert.deepEqual(targetedPersonalHealthWithoutOwner.manual_project_ids, ["personal-health"]);
  assert.equal(targetedPersonalHealthWithoutOwner.selected_projects[0].source.visibility, "PRIVATE");
  assert.equal(targetedPersonalHealthWithoutOwner.selected_projects[0].automatic_handoff, false);
  assert.equal(targetedPersonalHealthWithoutOwner.selected_projects[0].manual_owner_request, false);
  assert.doesNotMatch(JSON.stringify(targetedPersonalHealthWithoutOwner.selected_projects[0].source), /local_root/);
  assert.equal(targetedPersonalHealth.status, "ready_for_ai");
  assert.equal(targetedPersonalHealth.manual_owner_request, true);
  assert.equal(targetedPersonalHealth.selected_projects[0].refresh_mode, "manual_owner_only");
  assert.equal(targetedPersonalHealth.selected_projects[0].manual_owner_request, true);
  assert.deepEqual(targetedPersonalHealth.selected_projects[0].impact_sources, []);
  assert.equal(fullWithoutOwner.status, "manual_owner_request_required");
  assert.deepEqual(fullWithoutOwner.manual_project_ids, ["cacb", "learning", "codex-remote", "personal-health"]);
  assert.equal(full.mode, "all");
  assert.equal(full.status, "ready_for_ai");
  assert.deepEqual(full.selected_projects.map((item) => item.id), ["agents", "pcconfig", "github-index", "chinese-asr", "timeaudit", "pc-panel-hub", "cacb", "learning", "codex-remote", "personal-health"]);
  assert.match(full.materiality.default, /no website change/i);
  assert.match(full.anti_bloat.content_update, /never append refresh logs/i);
  assert.match(full.boundaries.rule_refresh, /verified current E release/i);
  assert.match(full.boundaries.publication, /automatically commit, normal-push existing PUBLIC main/i);
  assert.ok(full.ai_workflow.some((item) => /automatically commit, normal-push the existing PUBLIC main/i.test(item)));
  assert.ok(!full.ai_workflow.some((item) => /separate authorization|do not publish/i.test(item)));
  assert.deepEqual(after, before, "refresh planning changed narrative content");
  const missing = spawnSync(process.execPath, [script, "--project", "missing"], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /Unknown or disabled panel project/);

  const contract = await readFile(path.join(projectRoot, "docs", "maintenance", "ai-panel-refresh.md"), "utf8");
  assert.match(contract, /网页内容只由网站项目里的 AI 任务更新/);
  assert.match(contract, /全量刷新是全量复核，不是全量重写/);
  assert.match(contract, /一个阶段可以是一天或时间段/);
  assert.match(contract, /manual_owner_only/);
  assert.match(contract, /Source、材料、反馈、规则、Skill.*不能触发.*网站任务/s);
  assert.match(contract, /先让项目、Rules 和 Skills[\s\S]{0,180}本轮已验证、可发布的状态/);
  assert.match(contract, /manual_owner_only[\s\S]{0,160}保留上次已验证快照/);
  assert.match(contract, /Git 提交范围、变更路径和发布记录只用来指出“哪里值得看”/);
  assert.match(contract, /System 保持字节不变/);
  assert.match(contract, /不需要 watcher（文件监视器）、数据库、后台同步服务或第二个叙述生成器/);
  assert.match(contract, /首次完整版本发布前[\s\S]{0,260}属于基线建设缺陷/);
  assert.match(contract, /不用较短摘要、旧字段或生成快照覆盖已经完整、仍然正确的内容/);

  const tempRoot = await mkdtemp(path.join(tmpdir(), "wly-ai-refresh-test-"));
  try {
    const bundlePath = path.join(tempRoot, "bundle.json");
    const bundle = {
      schema: "wly.ai-panel-refresh-result.v1",
      mode: "all",
      manual_owner_request: true,
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
        manual_owner_request: item.refresh_mode === "manual_owner_only" ? true : null,
        reason: "fresh evidence did not change a material user judgment",
        observed_at: "2026-08-29T00:00:00Z",
        collectors: item.collectors.map((command) => ({ command, status: "pass", duration_seconds: 0.1 })),
        collector_receipts: (item.collector_requirements || []).map((requirement) => ({
          id: requirement.id,
          principal: requirement.required_principals[0],
          schema: requirement.expected_schema,
          pointer_path: requirement.pointer_path,
          complete_visibility: requirement.required_evidence.complete_visibility,
          generation_id: "taskscan-20260830t011100879-3ff5ec92330242fc",
          manifest_sha256: "c7142da1c440b1fda250c44fb7c0e60029e5f5e2e653140b7a025868921e98d8",
          artifact_sha256: "1b1e2da533baed1eb73dfc81aad70a9f43ebf904e28e2a54b4defd4b2fa3456f",
          observed_at: "2026-08-30T01:11:01.278Z"
        }))
      })),
      auto_repairs: [],
      blockers: []
    };
    await writeFile(bundlePath, JSON.stringify(bundle, null, 2), "utf8");
    const verification = JSON.parse(execFileSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true }));
    assert.equal(verification.status, "pass");
    assert.deepEqual(verification.counts, { changed: 0, unchanged: full.selected_projects.length, blocked: 0 });
    const nullCollector = structuredClone(bundle);
    nullCollector.projects.find((item) => item.id === "learning").collectors = [null];
    await writeFile(bundlePath, JSON.stringify(nullCollector, null, 2), "utf8");
    const nullCollectorRejected = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
    assert.notEqual(nullCollectorRejected.status, 0);
    assert.match(nullCollectorRejected.stdout, /bundle_collector_entry_invalid|bundle_collector_command_missing/);
    const wrongCollector = structuredClone(bundle);
    wrongCollector.projects.find((item) => item.id === "learning").collectors[0].command += " --wrong-command";
    await writeFile(bundlePath, JSON.stringify(wrongCollector, null, 2), "utf8");
    const wrongCollectorRejected = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
    assert.notEqual(wrongCollectorRejected.status, 0);
    assert.match(wrongCollectorRejected.stdout, /bundle_collector_command_unregistered|bundle_collector_command_missing/);
    const failedCollector = structuredClone(bundle);
    failedCollector.projects.find((item) => item.id === "learning").collectors[0].status = "failed";
    await writeFile(bundlePath, JSON.stringify(failedCollector, null, 2), "utf8");
    const failedCollectorRejected = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
    assert.notEqual(failedCollectorRejected.status, 0);
    assert.match(failedCollectorRejected.stdout, /bundle_collector_not_passed/);
    const invalid = structuredClone(bundle);
    invalid.projects.find((item) => item.id === "pcconfig").collector_receipts[0].principal = "ordinary-user";
    await writeFile(bundlePath, JSON.stringify(invalid, null, 2), "utf8");
    const rejected = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stdout, /bundle_collector_principal_invalid/);
    const manualRejected = structuredClone(bundle);
    manualRejected.manual_owner_request = false;
    manualRejected.projects.find((item) => item.id === "cacb").manual_owner_request = false;
    await writeFile(bundlePath, JSON.stringify(manualRejected, null, 2), "utf8");
    const manualRejection = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs"), "--bundle", bundlePath], { cwd: projectRoot, encoding: "utf8", windowsHide: true });
    assert.notEqual(manualRejection.status, 0);
    assert.match(manualRejection.stdout, /bundle_manual_owner_request_missing|bundle_project_manual_owner_request_missing/);
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
    assert.match(module.example, /我(?:说|问)[“"]/u, `${module.slug} does not begin from an ordinary user request`);
    assert.doesNotMatch(module.result, /^(?:E\d+|commit|ruleset|schema|process|port)\b/i, `${module.slug} result opens with a construction receipt`);
    assertReaderStates(module.readerStates, module.slug);
    assert.ok(module.decisionImpact.length >= 4, `${module.slug} lacks decision impact`);
    assert.ok(module.implementation.length >= 4, `${module.slug} implementation is incomplete`);
    assert.ok(module.flow.length >= 5, `${module.slug} flow is incomplete`);
    assert.ok(module.concepts.length >= 3, `${module.slug} concepts are incomplete`);
    assert.ok(module.boundaries.length >= 3, `${module.slug} boundaries are incomplete`);
    assert.ok(module.failures.length >= 3, `${module.slug} failures are incomplete`);
    assert.ok(module.sources.length >= 3, `${module.slug} sources are incomplete`);
    assert.ok(module.verification.length >= 3, `${module.slug} verification is incomplete`);
    assert.ok(module.sources.every((item) => item.path?.trim() && item.role?.trim()), `${module.slug} has a source without its real role`);
    assert.ok(module.failures.every((item) => item.condition?.trim() && item.response?.trim()), `${module.slug} has a failure without a recovery response`);
    assert.deepEqual(Object.keys(module.searchProjection), ["intents", "entities", "relations", "failureRecovery"], `${module.slug} search projection shape drifted`);
    for (const [key, values] of Object.entries(module.searchProjection)) {
      assert.ok(Array.isArray(values) && values.length >= 3 && values.length <= 8, `${module.slug}.${key} search projection is not bounded`);
      assert.equal(new Set(values).size, values.length, `${module.slug}.${key} search projection repeats an entry`);
      assert.ok(values.every((value) => typeof value === "string" && value.trim().length >= 3 && value.length <= 140), `${module.slug}.${key} search projection contains an invalid entry`);
    }
  }
  assert.ok(project.components.length >= 10);
  for (const key of ["why", "plainExample", "result"]) {
    assert.ok(project[key]?.length >= 80, `project overview lacks plain-language ${key}`);
  }
  assertReaderStates(project.readerStates, "project overview");
  assert.ok(project.glossary.length >= 25);
  assert.ok(project.usageExamples.length >= 5);
  assert.match(JSON.stringify(project.productPrinciples), /Hook只验真|Hook.*不替 AI 调度/);
  assert.match(JSON.stringify(project.productPrinciples), /自然能力要用自然请求验收|自主选对能力.*用户.*正确结果/);
  assert.match(JSON.stringify(project.productPrinciples), /官方更新.*版本号|package family.*事件.*能力/);
  const moduleSlugs = new Set(modules.map((item) => item.slug));
  assert.ok(project.usageExamples.every((item) => moduleSlugs.has(item.moduleSlug)), "an .agents usage example has no owning moduleSlug");
  assert.ok(new Set(project.usageExamples.map((item) => item.moduleSlug)).size >= modules.length, ".agents usage examples do not cover every module journey");
  assert.ok(project.evidenceLayers.length >= 6);
  assert.ok(project.operationalEntrypoints.length >= 5);
  assert.ok(project.evolution.length >= 10);
  assert.equal(new Set(project.evolution.map((item) => item.date)).size, project.evolution.length, "evolution timeline must group same-day implementation commits into one milestone");
});

test("the .agents capability route explains Hook timing, blind acceptance and official-update continuity", () => {
  const capability = modules.find((item) => item.slug === "capability-routing");
  const moduleText = JSON.stringify(capability);
  const guide = ruleGuides.capability_routing_contract;
  const guideText = JSON.stringify(guide);
  const rule = rulesSnapshot.rules.find((item) => item.logicalId === "capability_routing_contract");
  const ruleText = JSON.stringify(rule);

  assert.ok(capability.searchAliases.includes("Hook到底检查什么，谁决定开几个代理"));
  assert.ok(guide.searchAliases.includes("Hook到底检查什么，谁决定开几个代理"));
  for (const term of ["UserPromptSubmit", "SubagentStart", "PreToolUse", "implementation-blind fresh E2E", "route_selected_without_hint", "directed_execution_test", "package family", "versioned path"]) {
    assert.ok(moduleText.includes(term), `capability module omits ${term}`);
    assert.ok(guideText.includes(term), `capability rule guide omits ${term}`);
    assert.ok(ruleText.includes(term), `capability rule reference omits ${term}`);
  }
  for (const expected of [
    /UserPromptSubmit.*root.*SubagentStart.*child.*0–10.*判断前/,
    /AI.*决定.*0–10.*家族.*Hook.*不做调度|Hook.*不调度.*AI.*决定/,
    /PreToolUse.*spawn 前.*复核.*TOCTOU/,
    /旧 root.*完全没有 Hook.*用户明确 model\/effort.*回读.*thread binding/,
    /child 不继承|Child 不继承/,
    /Hook.*不调度|Hook.*不选择.*数量/,
    /不制造用户授权|不产生授权/,
    /root.*继续.*集成|Root.*继续.*集成/,
    /不点名 Skill.*tool.*plugin.*provider.*内部路径.*预期路线/,
    /route_selected_without_hint.*用户可见结果/,
    /directed.execution.test.*不能.*证明.*自己选择|directed_execution_test.*不能.*证明.*自主路由/,
    /package family.*signer\/principal.*event.*capability/,
    /app version.*build.*versioned.*path.*不.*准入/,
    /缺失.*event.*capability.*只.*关闭.*受影响/
  ]) assert.match(`${moduleText}\n${guideText}\n${ruleText}`, expected, `capability content omits stable journey semantics: ${expected}`);

  const identityStep = rule.process.findIndex((item) => item.includes("UserPromptSubmit") && item.includes("SubagentStart"));
  const decisionStep = rule.process.findIndex((item) => item.includes("AI") && item.includes("0–10"));
  const preToolStep = rule.process.findIndex((item) => item.includes("PreToolUse"));
  const blindStep = rule.process.findIndex((item) => item.includes("fresh evaluator"));
  assert.ok(identityStep >= 0 && identityStep < decisionStep && decisionStep < preToolStep && preToolStep < blindStep, "capability rule does not preserve identity-before-decision, create-time recheck and blind acceptance order");
  assert.ok(rule.forbidden.some((item) => item.includes("directed_execution_test") && item.includes("route_selected_without_hint")));
  assert.ok(rule.forbidden.some((item) => /app version.*build.*versioned path/.test(item)));

  assert.equal(projectCatalog.find((item) => item.project.slug === "agents").registration.ai_refresh.semantic_revision, 6);
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
  const authorizationRule = rulesSnapshot.rules.find((rule) => rule.logicalId === "authorization_delegation_contract");
  assert.match(JSON.stringify(authorizationRule), /PUBLIC 项目.*PRIVATE companion|PUBLIC ignored 私有材料/);
  assert.match(JSON.stringify(ruleGuides.authorization_delegation_contract), /PUBLIC 项目的私有伴随材料/);
});

test("Rules reader content stays ahead of release telemetry", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const ruleDetail = pageSource.slice(pageSource.indexOf("function RuleDetail"), pageSource.indexOf("function RulesPage"));
  const rulesPage = pageSource.slice(pageSource.indexOf("function RulesPage"), pageSource.indexOf("function SystemScenarioPanel"));
  assert.ok(ruleDetail.indexOf('className="rule-plain-language"') >= 0 && ruleDetail.indexOf('className="rule-plain-language"') < ruleDetail.indexOf('className="rule-identity-grid"'), "Rule telemetry appears before its plain-language reader layer");
  assert.ok(rulesPage.indexOf('className="rules-workbench"') >= 0 && rulesPage.indexOf('className="rules-workbench"') < rulesPage.indexOf('className="rules-dashboard-bar"'), "Release dashboard appears before the rule reader workbench");
});

test("each current rule tells an ordinary reader how it applies without manual invocation", () => {
  assert.equal(rulesSnapshot.rules.length, 5);
  const readerConstructionTerms = /\b(?:E release|generation|Publisher|anchor|manifest|ledger|fallback|root|child|successor|durable grant)\b/i;
  for (const rule of rulesSnapshot.rules) {
    assert.match(rule.example, /你不需要/iu, `${rule.logicalId} does not explain automatic use`);
    assert.match(rule.example, /说|问/iu, `${rule.logicalId} lacks a natural-language request example`);
    const readerLayer = JSON.stringify({ question: rule.question, plainLanguage: rule.plainLanguage, why: rule.why, result: rule.result, readerStates: rule.readerStates });
    assert.doesNotMatch(readerLayer, readerConstructionTerms, `${rule.logicalId} reader layer opens with construction vocabulary`);
    assert.ok(rule.question.length >= 16 && rule.plainLanguage.length >= 45 && rule.result.length >= 35, `${rule.logicalId} reader layer is too thin`);
  }
  const rootRule = rulesSnapshot.rules.find((rule) => rule.logicalId === "agents_root_rules");
  const protectionRule = rulesSnapshot.rules.find((rule) => rule.logicalId === "protected_major_actions_contract");
  const authorizationRule = rulesSnapshot.rules.find((rule) => rule.logicalId === "authorization_delegation_contract");
  const contextRule = rulesSnapshot.rules.find((rule) => rule.logicalId === "four_base_decision_context_contract");
  const capabilityRule = rulesSnapshot.rules.find((rule) => rule.logicalId === "capability_routing_contract");
  assert.match(JSON.stringify({ question: rootRule.question, plainLanguage: rootRule.plainLanguage, result: rootRule.result }), /当前用户要求|项目规则|事实来源/);
  assert.match(JSON.stringify({ question: protectionRule.question, plainLanguage: protectionRule.plainLanguage, result: protectionRule.result }), /当前可用版|上一可用版|生效位置/);
  assert.match(JSON.stringify({ question: authorizationRule.question, plainLanguage: authorizationRule.plainLanguage, result: authorizationRule.result }), /不用|不反复|发生变化/);
  assert.match(JSON.stringify({ question: contextRule.question, plainLanguage: contextRule.plainLanguage, result: contextRule.result }), /规则|Git|PCConfig|项目/);
  assert.match(JSON.stringify({ question: capabilityRule.question, plainLanguage: capabilityRule.plainLanguage, result: capabilityRule.result }), /AI|工具|能力|并行|不可用/);
  assert.match(capabilityRule.example, /核对[\s\S]*文书[\s\S]*逐页[\s\S]*PDF|核对[\s\S]*文书[\s\S]*PDF[\s\S]*逐页/);
  assert.match(capabilityRule.example, /未知|不能确认/);
});

test("the Skills catalog contains the selected usable capabilities in value order", () => {
  assert.equal(skills.length, 27);
  assert.deepEqual(skills.map((item) => item.slug), [
    "personal-media",
    "personal-materials",
    "wechat-direct",
    "google-workspace-direct",
    "chinese-asr",
    "timeaudit-diagnostics",
    "localocr",
    "personal-health",
    "document-materials",
    "work-delivery",
    "documents",
    "pdf",
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
    for (const key of ["name", "title", "status", "summary", "maturity", "sourcePath", "provenance", "sourceKind", "availability"]) {
      assert.ok(item[key]?.length >= 1, `${item.slug}.${key} is missing`);
    }
    assert.ok(["personal_install", "host_integrated"].includes(item.sourceKind), `${item.slug}.sourceKind is invalid`);
    assert.equal(item.availability, "available", `${item.slug} is not publicly usable`);
    if (item.sourceKind === "personal_install") {
      assert.equal(path.win32.isAbsolute(item.sourcePath), true, `${item.slug}.sourcePath is not an absolute Windows path`);
    } else {
      assert.equal(item.sourcePath, item.capabilityId);
      assert.match(item.capabilityId, /^host:[a-z-]+$/);
      assert.equal(path.win32.isAbsolute(item.observedSourcePath), true, `${item.slug}.observedSourcePath is not an absolute Windows path`);
    }
    assert.doesNotMatch(item.sourcePath, /[\t\r\n]/, `${item.slug}.sourcePath contains an escaped control character`);
    assert.ok(["pass", "mixed", "unknown", "problem"].includes(item.statusTone), `${item.slug}.statusTone is invalid`);
    assert.ok(item.transactionState.length >= 10, `${item.slug}.transactionState is incomplete`);
    if (item.sourceKind === "personal_install") {
      assert.match(item.evidenceSourceCommit, /^[a-f0-9]{40}$/);
      assert.match(item.supplyEvidenceCommand, /Test-PersonalSkillSupply\.ps1/);
    } else {
      assert.equal(item.evidenceSourceCommit, null, item.slug + " incorrectly inherits the E rules Git commit");
      assert.match(item.supplyEvidenceCommand, /workspace dependency loader/);
      assert.ok(Number.isInteger(item.sourceBytes) && item.sourceBytes > 0, item.slug + ".sourceBytes is invalid");
      assert.match(item.sourceSha256, /^[a-f0-9]{64}$/, item.slug + ".sourceSha256 is invalid");
      assert.ok(item.evidenceObservedAt.length >= 20, item.slug + ".evidenceObservedAt is incomplete");
      assert.doesNotMatch([item.dependencies.join("\n"), item.tests, item.evidenceBasis].join("\n"), /openai-primary-runtime\\(?:documents|pdf)\\\d|\b\d+ bytes\b|SHA-256|26\.826\.12353/, item.slug + " duplicates its structured source receipt in prose");
    }
    for (const key of ["useWhen", "avoidWhen", "inputs", "outputs", "flow", "boundaries", "dependencies"]) {
      assert.ok(item[key].length >= 1, `${item.slug}.${key} is incomplete`);
    }
    for (const dependency of item.dependencies.filter((value) => /^[A-Za-z]:/.test(value))) {
      assert.equal(path.win32.isAbsolute(dependency), true, `${item.slug} has a malformed Windows dependency path: ${dependency}`);
      assert.doesNotMatch(dependency, /[\t\r\n]/, `${item.slug} dependency path contains an escaped control character`);
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
  assert.equal(skills.filter((item) => item.sourceKind === "personal_install").length, 25);
  assert.equal(skills.filter((item) => item.sourceKind === "host_integrated").length, 2);
  assert.equal(new Set(skills.map((item) => item.slug)).size, skills.length);
  assert.doesNotMatch(JSON.stringify(skills), /codex-local-remote-control/);
  for (const item of skills.filter((entry) => Object.hasOwn(entry, "sourceBytes") || Object.hasOwn(entry, "sourceSha256"))) {
    assert.ok(Number.isInteger(item.sourceBytes) && item.sourceBytes > 0, item.slug + ".sourceBytes is invalid");
    assert.match(item.sourceSha256, /^[a-f0-9]{64}$/, item.slug + ".sourceSha256 is invalid");
    assert.ok(item.evidenceObservedAt.length >= 20, item.slug + ".evidenceObservedAt is incomplete");
    assert.doesNotMatch(item.tests, /\b\d+ bytes\b|SHA-256|[a-f0-9]{64}/, item.slug + ".tests duplicates its structured source receipt");
  }
  const documentMaterials = skills.find((item) => item.slug === "document-materials");
  const documentMaterialsGuide = skillGuides["document-materials"];
  const documentMaterialsText = JSON.stringify({ entry: documentMaterials, guide: documentMaterialsGuide, outcome: skillOutcomes["document-materials"] });
  assert.deepEqual({ slug: documentMaterials.slug, name: documentMaterials.name, title: documentMaterials.title }, { slug: "document-materials", name: "document-materials", title: "文书和材料制作" });
  assert.equal(documentMaterials.registryName, "personal-formal-documents");
  assert.match(documentMaterials.sourcePath, /\\personal-formal-documents\\SKILL\.md$/);
  assert.equal(documentMaterials.sourceBytes, 2159);
  assert.equal(documentMaterials.sourceSha256, "a006fe6a82423935c4a058a02d9d91f031518ba91fa7d6e5757009bc6fb3503f");
  assert.match(documentMaterials.evidenceSourceCommit, /^[a-f0-9]{40}$/);
  assert.doesNotMatch(documentMaterialsText, /personal-litigation|litigation|lawsuit|\blegal\b|legal-filing-kit|诉讼|法律|案件|起诉|法院/i, "public document-materials copy must remain domain-neutral");
  for (const expected of [
    /起草或修订合同/,
    /协议/,
    /通知/,
    /信访\/投诉/,
    /售后索赔/,
    /争议函件/,
    /申请材料/,
    /证据清单/,
    /提交包/,
    /原件/,
    /格式.*证据验收/,
    /材料已生成.*本人已操作.*平台已收到.*接收方已处理/,
    /期限/,
    /恢复点/,
    /本人明确决定继续.*完成核对的可使用成品.*取消.*未操作.*失败.*撤回.*延期.*避免重复操作/,
    /未全部完成真实 E2E（端到端）验收/
  ]) assert.match(documentMaterialsText, expected, `document-materials omits stable public workflow semantics: ${expected}`);
  const readyOnlyFailure = documentMaterialsGuide.failures.find((item) => item[0].includes("只有可使用成品"));
  assert.match(readyOnlyFailure.join("\n"), /Unknown|未知/);
  assert.match(readyOnlyFailure.join("\n"), /现实状态回读/);
  const workDelivery = skills.find((item) => item.slug === "work-delivery");
  const workDeliveryText = JSON.stringify({ entry: workDelivery, guide: skillGuides["work-delivery"], outcome: skillOutcomes["work-delivery"] });
  assert.equal(workDelivery.sourcePath, "E:\\.agents\\skills\\work-delivery\\SKILL.md");
  assert.equal(workDelivery.sourceBytes, 3369);
  assert.equal(workDelivery.sourceSha256, "e9fc8080d60363850e257e4c58de55e9737b57ddcf1ab862f4dd84878428ec16");
  for (const expected of [/明确选中/, /事实.*假设.*冲突.*未知/, /同一事实版本/, /PRD/, /项目计划/, /评审 PPT/, /执行表/, /周报/, /汇报/, /5 分钟/, /10–15 分钟/, /20 分钟/, /15 秒/, /来源变化/, /受影响/, /过期/, /一次性单文件编辑/, /本轮.*没有.*E2E|E2E.*本轮.*Unknown/]) {
    assert.match(workDeliveryText, expected, `work-delivery omits its product contract: ${expected}`);
  }
  const firstUseCases = [
    ["documents", "DOCX", "DOCX（可编辑 Word 文档）"],
    ["documents", "bundle", "bundle（宿主能力包）"],
    ["pdf", "Widget", "Widget（页面表单控件）"],
    ["pdf", "bundle", "bundle（宿主能力包）"],
    ["file-intake-router", "DOCX", "DOCX（可编辑 Word 文档）"],
    ["authorization-file-broker", "bundle", "bundle（加密包）"]
  ];
  for (const [slug, term, glossed] of firstUseCases) {
    const outcome = skillOutcomes[slug];
    const readerText = JSON.stringify({ value: outcome.value, why: outcome.why, example: outcome.example, result: outcome.result, readerStates: outcome.readerStates, changes: outcome.changes });
    const firstIndex = readerText.indexOf(term);
    assert.ok(firstIndex >= 0, slug + " reader layer omits " + term);
    assert.equal(readerText.slice(firstIndex, firstIndex + glossed.length), glossed, slug + " first " + term + " use lacks a Chinese gloss");
  }
  assert.equal(excludedSkills.length, 0);
});

test("project and Skill links come from one explicit ownership map", async () => {
  const skillBySlug = new Map(skills.map((item) => [item.slug, item]));
  const projectBySlug = new Map(projectCatalog.map((entry) => [entry.project.slug, entry]));
  const systemAssets = new Set(systemProjectDomains.flatMap((domain) => domain.assets.map((asset) => asset.id)));
  const agentsMapped = [];
  for (const [skillSlug, relations] of Object.entries(skillProjectLinks)) {
    assert.ok(skillBySlug.has(skillSlug), `capability relation references missing Skill: ${skillSlug}`);
    const skillHtml = await readFile(path.join(projectRoot, "dist", "skills", skillSlug, "index.html"), "utf8");
    for (const relation of relations) {
      let href = relation.href || null;
      if (relation.projectSlug) {
        const projectEntry = projectBySlug.get(relation.projectSlug);
        assert.ok(projectEntry, `${skillSlug} references missing project: ${relation.projectSlug}`);
        const module = relation.moduleSlug ? projectEntry.modules.find((item) => item.slug === relation.moduleSlug) : null;
        if (relation.moduleSlug) assert.ok(module, `${skillSlug} references missing module: ${relation.projectSlug}/${relation.moduleSlug}`);
        href = module ? `${projectEntry.project.route}/${module.slug}` : projectEntry.project.route;
        const projectHtml = await readFile(path.join(projectRoot, "dist", ...projectEntry.project.route.slice(1).split("/"), "index.html"), "utf8");
        assert.ok(projectHtml.includes(`/skills/${skillSlug}/`), `${projectEntry.project.slug} does not link back to ${skillSlug}`);
        if (relation.projectSlug === "agents") agentsMapped.push(skillSlug);
      } else if (relation.systemAssetId) {
        assert.ok(systemAssets.has(relation.systemAssetId), `${skillSlug} references missing System asset: ${relation.systemAssetId}`);
        href = `/#system-project-asset-${relation.systemAssetId}`;
      }
      if (href) {
        const target = new URL(href, "https://wly0829.cn");
        const canonicalHref = `${canonicalPath(target.pathname)}${target.search}${target.hash}`;
        assert.ok(skillHtml.includes(`href="${canonicalHref}"`), `${skillSlug} does not link to ${canonicalHref}`);
      }
    }
  }
  assert.ok(new Set(agentsMapped).size < skills.length / 2, "Skills were blindly assigned to .agents");
  const agentsHtml = await readFile(path.join(projectRoot, "dist", "projects", "agents", "index.html"), "utf8");
  assert.ok(projectReferenceLinks.agents.some((item) => item.href === "/rules"));
  assert.ok(agentsHtml.includes('href="/rules/"'), ".agents project does not link to current Rules");
  const systemHtml = await readFile(path.join(projectRoot, "dist", "index.html"), "utf8");
  assert.doesNotMatch(systemHtml, /<a(?:\s|>)[^>]*class="system-project-asset-card"/, "System project cards must not nest project and Skill anchors");
  assert.match(systemHtml, /class="system-project-asset-actions"/);
  assert.ok(systemHtml.includes('href="/skills/work-delivery/"'), "System work-delivery asset does not link to its Skill");
  assert.ok(systemHtml.includes("Skill：工作交付副驾驶"), "System Skill actions must show the full Skill name");
});

test("native routing public copy explains the Hook identity path without expanding authority", () => {
  const nativeRouting = skills.find((item) => item.slug === "native-economy-routing");
  const nativeRoutingText = JSON.stringify({ entry: nativeRouting, guide: skillGuides["native-economy-routing"], outcome: skillOutcomes["native-economy-routing"] });
  for (const term of ["UserPromptSubmit", "SubagentStart", "verified model", "effective effort", "root/child", "turn hash", "E release", "contract SHA", "thread binding", "PreToolUse", "TOCTOU", "Stop Hook", "app version", "versioned path", "Luna", "Terra", "Sol"]) {
    assert.ok(nativeRoutingText.includes(term), `native routing public copy omits ${term}`);
  }
  for (const expected of [
    /UserPromptSubmit.*SubagentStart.*0–10.*前.*注入/,
    /旧 root.*完全没有 Hook.*用户明确 model\/effort.*写入.*回读.*thread binding/,
    /child 不继承/,
    /PreToolUse.*spawn 前.*TOCTOU.*家族.*effort.*参数/,
    /Hook 只验证.*身份.*E identity.*参数/,
    /不选择.*家族.*数量|不选择模型家族或代理数量/,
    /不创建 child/,
    /不制造授权/,
    /Hook.*缺失.*只关闭委派.*普通任务继续/,
    /不依赖 Stop Hook/,
    /app version.*versioned path.*不是准入/,
    /0.*10/,
    /root.*不空等|Root.*不原地空等/
  ]) assert.match(nativeRoutingText, expected, `native routing public copy omits a stable Hook boundary: ${expected}`);
});

test("generic Hook annotation stays neutral while owning content explains each event", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  assert.match(pageSource, /\["Hook", "钩子"\]/);
  assert.doesNotMatch(pageSource, /\["Hook", "提交前钩子"\]/);
  const skillsHtml = await readFile(path.join(projectRoot, "dist", "skills", "native-economy-routing", "index.html"), "utf8");
  assert.doesNotMatch(skillsHtml, /Stop Hook（提交前钩子）|Git Hook（提交前钩子）/);
});

test("global search handles natural rewrites, mixed Latin terms and bounded broad results", async () => {
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
  for (const [query, href] of [
    ["新建一个私有仓库", "/projects/github-index/protected-major-actions"],
    ["这个目录会推到哪里", "/projects/github-index/project-admission"],
    ["分支推了算完成吗", "/projects/github-index/worktree-sync"],
    ["工作树能删吗", "/projects/github-index/worktree-sync"],
    ["公开仓库里什么能发", "/projects/github-index/publication-gate"],
    ["索引中断怎么恢复", "/projects/github-index/snapshot-recovery"]
  ]) assert.equal(searchPanel(query)[0]?.href, href, `GitHub index search misroutes: ${query}`);
  assert.equal(searchPanel("ChineseASR")[0]?.title, "ChineseASR · 总览");
  assert.equal(searchPanel("TimeAudit")[0]?.title, "TimeAudit · 总览");
  assert.equal(searchPanel("PC Panel Hub")[0]?.title, "PC Panel Hub · 总览");
  assert.equal(searchPanel("CACB")[0]?.title, "CACB Agent 能力基准 · 总览");
  assert.equal(searchPanel("AI帮我学习")[0]?.title, "用 AI 把一件事学明白 · 总览");
  assert.equal(searchPanel("健康信息怎么判断能不能用")[0]?.title, "个人健康证据与安全决策 · 总览");
  assert.equal(searchPanel("过去一小时为什么卡")[0]?.title, "timeaudit-diagnostics");
  assert.equal(searchPanel("来源变更后哪些文档要重做")[0]?.href, "/skills/work-delivery");
  assert.equal(searchPanel("需求变了怎么同步PRD和执行表")[0]?.href, "/skills/work-delivery");
  assert.equal(searchPanel("帮我起草合同并整理材料包")[0]?.href, "/skills/document-materials");
  assert.ok(searchPanel("没有游戏帧是不是掉帧").some((item) => item.href === "/skills/timeaudit-diagnostics"));
  for (const query of ["1 秒 FPS 采样", "前台卡顿分析", "时间都花在哪", "数据库行和窗口标题不公开"]) {
    assert.ok(searchPanel(query).some((item) => item.href.startsWith("/projects/timeaudit")), `TimeAudit search misses: ${query}`);
  }
  for (const query of ["机箱屏冻结", "command 204", "HS2 六卡", "实体像素验收"]) {
    assert.ok(searchPanel(query).some((item) => item.href.startsWith("/projects/pc-panel-hub")), `PC Panel Hub search misses: ${query}`);
  }
  for (const query of ["回答完成却没有结果", "隔离 workspace", "隐藏验证", "能力问题还是执行环境问题"]) {
    assert.ok(searchPanel(query).some((item) => item.href.startsWith("/projects/cacb")), `CACB search misses: ${query}`);
  }
  for (const [query, href] of [
    ["查权威资料再回答", "/projects/learning/authoritative-research"],
    ["专业资料讲人话", "/projects/learning/plain-language"],
    ["有分歧重新搜索", "/projects/learning/dialogue-revision"],
    ["AI题目不计分", "/projects/learning/questions-validation"],
    ["AI不监督不催促", "/projects/learning/human-control-simple"]
  ]) {
    assert.equal(searchPanel(query)[0]?.href, href, `learning search misroutes: ${query}`);
  }
  for (const [query, href] of [
    ["手机和桌面同一个任务", "/projects/codex-remote/same-task-control"],
    ["给正在生成的回复补充要求", "/projects/codex-remote/conversation-control"],
    ["停止正在生成的Codex回复", "/projects/codex-remote/conversation-control"],
    ["把消息排到下一轮", "/projects/codex-remote/conversation-control"],
    ["断线后会不会重复发送", "/projects/codex-remote/conversation-control"],
    ["手机处理Codex审批", "/projects/codex-remote/models-approvals-context"],
    ["手机浏览电脑文件", "/projects/codex-remote/projects-files-input"],
    ["Broker Sidecar架构", "/projects/codex-remote/shared-realtime-architecture"],
    ["Codex Remote安全吗", "/projects/codex-remote/security-public-access"],
    ["Codex Remote跑通过吗", "/projects/codex-remote/versions-evidence"]
  ]) {
    assert.equal(searchPanel(query)[0]?.href, href, `Codex Remote search misroutes: ${query}`);
  }
  for (const [query, href] of [
    ["健康问题要不要重读报告", "/projects/personal-health/current-evidence-route"],
    ["这个健康问题先看什么资料", "/projects/personal-health/current-evidence-route"],
    ["Fitbit一次授权", "/projects/personal-health/protected-foreground-refresh"],
    ["我想主动更新一次设备数据", "/projects/personal-health/protected-foreground-refresh"],
    ["健康导入断点续跑", "/projects/personal-health/raw-preservation-resume"],
    ["设备导出中断后要不要重下", "/projects/personal-health/raw-preservation-resume"],
    ["decision_ready健康字段", "/projects/personal-health/offline-decision-brief"],
    ["哪些设备数据能用于这次判断", "/projects/personal-health/offline-decision-brief"],
    ["健康证据三态", "/projects/personal-health/evidence-three-state"],
    ["有记录为0和没有记录的区别", "/projects/personal-health/evidence-three-state"],
    ["健康数据谁决定采用", "/projects/personal-health/health-owner-boundary"],
    ["重大医疗选择怎样保护我的决定权", "/projects/personal-health/health-owner-boundary"]
  ]) {
    assert.equal(searchPanel(query)[0]?.href, href, `personal-health search misroutes: ${query}`);
  }
  const searchSource = await readFile(path.join(projectRoot, "app", "search.js"), "utf8");
  assert.doesNotMatch(searchSource, /\/projects\/timeaudit|TimeAudit · 总览/, "project routes and titles must derive from projectCatalog; Skill aliases may still name TimeAudit");
  assert.equal(searchPanel("刷新看板")[0]?.title, "personal-panel-refresh");
  assert.equal(searchPanel("长音频断点续跑")[0]?.title, "连续时间线、长音频断点续跑与文件夹批量");
  assert.ok(searchPanel("的").length > 9, "broad search should retain the true total before UI truncation");
});

test("shared search scopes, project reading layers, Skills categories and System stay coherent", async () => {
  assert.equal(searchScopeForPath("/").id, "all");
  assert.equal(searchScopeForPath("/projects").id, "project");
  assert.equal(searchScopeForPath("/system").id, "system");
  assert.equal(searchScopeForPath("/rules").id, "rules");
  assert.equal(searchScopeForPath("/skills").id, "skills");
  assert.equal(searchScopeForPath("/projects/timeaudit/hardware-performance").id, "project:timeaudit");
  assert.ok(searchPanel("卡顿", "project").every((entry) => entry.type === "项目"), "project-index search must land on project entities");
  assert.equal(searchPanel("ProxyClean", "project")[0]?.href, "/#system-project-asset-proxy-clean");
  assert.ok(searchPanel("FPS", "project:timeaudit").every((entry) => entry.projectSlug === "timeaudit"), "project search escaped the current project");
  assert.ok(searchPanel("授权", "rules").every((entry) => entry.group === "规则"), "rule search leaked another surface");
  assert.ok(searchPanel("照片", "skills").every((entry) => entry.group === "Skills"), "Skills search leaked another surface");
  assert.ok(searchPanel("昨晚电脑为什么卡", "system").some((entry) => entry.href.startsWith("/#system-scenario-")), "system search misses a real work journey");

  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const runtimeSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  const styleSource = await readFile(path.join(projectRoot, "app", "style.css"), "utf8");
  for (const text of ["速览", "产品", "技术"]) assert.ok(pageSource.includes(text), `project reading layer is missing: ${text}`);
  assert.match(pageSource, /currentProject\.productPrinciples\?\.length/);
  assert.match(runtimeSource, /function initializeProjectReadingLayers\(\)/);
  assert.match(runtimeSource, /function initializeSystemHome\(\)/);
  assert.match(pageSource, /data-system-case-scroll-indicator[\s\S]{0,120}左右滑动查看更多/);
  assert.match(runtimeSource, /function updateScenarioScrollIndicator\(\)/);
  assert.match(runtimeSource, /--scenario-scroll-thumb-width/);
  assert.match(runtimeSource, /tabRail\?\.addEventListener\("scroll", updateScenarioScrollIndicator/);
  assert.match(styleSource, /\.system-case-scroll-indicator\s*\{[\s\S]*?min-height:\s*28px;[\s\S]*?\.system-case-scroll-indicator i\s*\{[\s\S]*?--scenario-scroll-thumb-left/);
  assert.match(runtimeSource, /function initializeSystemSectionNavigation\(\)/);
  assert.match(runtimeSource, /function targetReached\(index\)/);
  assert.match(runtimeSource, /window\.history\.replaceState\(window\.history\.state,[\s\S]{0,180}window\.scrollTo\(\{ top: targetTop, behavior: "instant" \}\)/);
  assert.match(runtimeSource, /section\.getBoundingClientRect\(\)\.top <= readingLine \+ 2/);
  assert.match(runtimeSource, /Math\.ceil\(window\.scrollY \+ sections\[index\]\.getBoundingClientRect\(\)\.top - readingLine\)/);
  assert.match(runtimeSource, /window\.addEventListener\("scrollend", \(\) => releaseClickLock\(\)\)/);
  assert.match(runtimeSource, /function initializeSkillCategories\(\)/);
  assert.match(runtimeSource, /function initializeSearchResultsPage\(\)/);
  assert.match(runtimeSource, /function normalizedSearchScope\(value\)/);
  assert.match(runtimeSource, /const scope = normalizedSearchScope\(params\.get\("scope"\) \|\| "all"\)/);
  assert.match(runtimeSource, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(runtimeSource, /searchCompactEntries\(searchEntries, query, scope\)/);
  assert.match(runtimeSource, /input\.value = query/);
  assert.match(runtimeSource, /查看全部 \$\{results\.length\} 条结果/);
  assert.match(runtimeSource, /if \(!results\.length\)[\s\S]*?\}\s*if \(usesPartialAllIndex \|\| results\.length > 9\)/, "quick all-site misses must still expose the full-search route");
  assert.match(styleSource, /\.skill-category-rail\s*\{[\s\S]*?display:\s*flex;[\s\S]*?overflow-x:\s*auto/);
  assert.match(styleSource, /\.project-card-snapshot-boundary[\s\S]*?background:\s*#fff8df/);
  assert.match(styleSource, /\.search-results-page h1\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*break-word;/);
  assert.match(pageSource, /primaryHref === "\/skills" \|\| primaryHref\.startsWith\("\/skills\/"\)/);
  assert.match(runtimeSource, /if \(id\) activateScenario\(id\);/);
  assert.match(runtimeSource, /activateScenario\(idFromHash\(\) \|\| ids\[0\]\)/);

  const systemHtml = await readFile(path.join(projectRoot, "dist", "index.html"), "utf8");
  assert.match(systemHtml, /class="system-home"/);
  for (const text of [systemHomeHero.eyebrow, systemHomeHero.title, "通用 AI 与智能体能力", "各层验证分别能证明什么", "下一步去哪里看完整细节"]) assert.ok(systemHtml.includes(text), `System home omits: ${text}`);
  assert.equal((systemHtml.match(/data-system-scenario-tab=/g) || []).length, systemScenarios.length);
  assert.equal((systemHtml.match(/data-system-scenario-panel=/g) || []).length, systemScenarios.length);
  assert.equal((systemHtml.match(/data-system-dependency-node=/g) || []).length, systemDependencyNodes.length);
  for (const scenario of systemScenarios) assert.ok(systemHtml.includes(`id="system-scenario-${scenario.id}"`), `System scenario missing: ${scenario.id}`);
  for (const node of systemDependencyNodes) {
    assert.ok(systemHtml.includes(`id="system-node-${node.id}"`), `System node missing: ${node.id}`);
    for (const href of [...(node.links?.map((item) => item.href) || [node.href]), node.searchHref].filter(Boolean)) {
      if (href.startsWith("/")) {
        const pathname = new URL(href, "https://wly0829.cn").pathname.replace(/\/$/, "") || "/";
        assert.ok(routePaths.includes(pathname), `System node ${node.id} points to a missing route: ${href}`);
      }
    }
  }
  const systemNodeIds = new Set(systemDependencyNodes.map((node) => node.id));
  assert.equal(systemDependencyNodes.length, 48, "System composition must retain all 48 independently reviewed responsibility cards");
  for (const expected of ["direct-input", "mixed-file-intake", "mojibake-repair", "execution-owner", "durable-task-state", "message-ai-gateway", "work-delivery", "ai-cli-entry", "local-ai-runtime", "llm-backend-job", "cross-device-files", "remote-workstation", "wechat-bridge", "wechat-direct", "companion-laptop", "career-development"]) assert.ok(systemNodeIds.has(expected), `System composition omits necessary node: ${expected}`);
  for (const duplicate of ["all-projects", "document-output-choice", "ai-runtime-entry", "cross-device-workstation", "wechat"]) assert.ok(!systemNodeIds.has(duplicate), `System composition retains duplicate/non-component card: ${duplicate}`);
  assert.ok(systemScenarios.every((scenario) => !Object.hasOwn(scenario, "dependencyIds")), "System scenarios must not retain dead cross-section highlight dependencies");
  assert.doesNotMatch(JSON.stringify(systemScenarios.map((scenario) => scenario.systems)), /材料库|媒体库/, "Scenario contracts must name direct originals instead of imaginary material libraries");
  assert.equal(systemDependencyNodes.find((node) => node.id === "materials")?.title, "位置未知时的非媒体原件查找");
  assert.match(systemDependencyNodes.find((node) => node.id === "work-delivery")?.detail || "", /质量未就绪时不生成正式 Office 成品/);
  assert.match(JSON.stringify(systemRuleStories.find((story) => story.id === "intent-to-capability")), /现有或原生入口已经满足时[\s\S]*不增加第二套适配器[\s\S]*自造复杂度导致失败时先删除或绕开/);
  assert.doesNotMatch(systemHtml, /data-system-scenarios=|data-system-node-state|本次使用|本次未用|上方场景会用到|其他场景按需使用/);
  assert.doesNotMatch(runtimeSource, /node\.classList\.toggle\("is-used"/);
  assert.match(styleSource, /\.system-dependency-node\s*\{[^}]*border:\s*2px solid var\(--green\);[^}]*background:\s*var\(--surface-green\);/);
  assert.match(styleSource, /data-node-mod-4="2"[\s\S]{0,180}grid-column:\s*span 6/);
  assert.match(styleSource, /data-node-mod-3="2"[\s\S]{0,180}grid-column:\s*span 3/);
  assert.match(styleSource, /data-node-mod-2="1"[\s\S]{0,180}grid-column:\s*1\s*\/\s*-1/);
  for (const layer of systemEvidenceLayers) assert.ok(systemHtml.includes(layer.title), `System evidence layer missing: ${layer.id}`);
  for (const item of systemDirectoryIntroductions) assert.ok(systemHtml.includes(`id="system-directory-${item.id}"`), `System directory intro missing: ${item.id}`);
  assert.equal(systemRuleStories.length, 5);
  assert.equal(systemSkillFamilies.flatMap((family) => family.members).length, skills.length);
  assert.equal(new Set(systemSkillFamilies.flatMap((family) => family.members.map((member) => member.slug))).size, skills.length);
  const systemProjectAssets = systemProjectDomains.flatMap((domain) => domain.assets);
  assert.equal(systemProjectAssets.length, systemProjectInventory.total);
  assert.equal(new Set(systemProjectAssets.map((asset) => asset.id)).size, systemProjectInventory.total);
  assert.match(systemProjectInventory.identitySha256, /^sha256:[a-f0-9]{64}$/);
  assert.equal(systemProjectSourceMap.length, systemProjectInventory.total);
  assert.equal(new Set(systemProjectSourceMap.map((entry) => entry.assetId)).size, systemProjectInventory.total);
  assert.equal(new Set(systemProjectSourceMap.map((entry) => entry.sourceIdentity)).size, systemProjectInventory.total);
  assert.ok(systemProjectSourceMap.every((entry) => !entry.sourceIdentity.endsWith("undefined")));
  assert.equal(systemProjectInventory.total, 48);
  assert.deepEqual(
    { publicCount: systemProjectInventory.publicCount, privateCount: systemProjectInventory.privateCount, localCloneCount: systemProjectInventory.localCloneCount, remoteOnlyCount: systemProjectInventory.remoteOnlyCount },
    { publicCount: 27, privateCount: 21, localCloneCount: 45, remoteOnlyCount: 3 }
  );
  const githubInventoryText = JSON.stringify(githubIndexProject.currentSnapshot);
  for (const expected of ["48", "27", "21", "45", "3"]) assert.ok(githubInventoryText.includes(expected), `GitHub project snapshot omits current System inventory value: ${expected}`);
  const workDeliveryAsset = systemProjectAssets.find((asset) => asset.id === "work-delivery-copilot");
  assert.deepEqual({ title: workDeliveryAsset.title, repo: workDeliveryAsset.repo, visibility: workDeliveryAsset.visibility }, { title: "工作交付副驾驶", repo: "work-delivery-copilot", visibility: "PRIVATE" });
  for (const [assetId, repo] of [["ai-workbench-playbook", "codex-app-power-user-playbook"], ["message-ai-gateway", "OpenClawGateway"], ["local-ai-runtime", "rtx5090d-ollama-agent-bundle"], ["human-alignment-dataset", "human-alignment-dataset-001"]]) {
    assert.equal(systemProjectAssets.find((asset) => asset.id === assetId)?.repo, repo, `System atlas hides public repository identity: ${assetId}`);
    assert.equal(systemProjectSourceMap.find((entry) => entry.assetId === assetId)?.sourceIdentity, `repo:${repo}`, `System source map treats public repository as private digest: ${assetId}`);
  }
  assert.equal(systemProjectSourceMap.find((entry) => entry.assetId === "formal-materials")?.sourceIdentity, "sha256:d7ee4166428ce9693707b475e930a74b059b81610a1084eec495864ef258578d");
  assert.doesNotMatch(systemHtml, /项呈现基础设施|system-project-presentation-note/);
  assert.match(systemHtml, /网站源码仓库计入总账，但不作为系统资产卡展示/);
  const atlasMappingText = [...systemProjectSourceMap].sort((left, right) => left.assetId.localeCompare(right.assetId)).map((entry) => `${entry.assetId}=${entry.sourceIdentity}`).join("\n");
  assert.equal(`sha256:${createHash("sha256").update(atlasMappingText).digest("hex")}`, systemProjectInventory.mappingSha256);
  assert.match(systemProjectInventory.mappingSha256, /^sha256:[a-f0-9]{64}$/);
  for (const story of systemRuleStories) assert.ok(systemHtml.includes("id=\"system-rule-story-" + story.id + "\""));
  for (const family of systemSkillFamilies) assert.ok(systemHtml.includes("id=\"system-skill-family-" + family.id + "\""));
  for (const domain of systemProjectDomains) assert.ok(systemHtml.includes("id=\"system-project-domain-" + domain.id + "\""));
  for (const asset of systemProjectAssets) {
    const pathname = new URL(asset.href, "https://wly0829.cn").pathname.replace(/\/$/, "") || "/";
    assert.ok(routePaths.includes(pathname), "System project asset points to a missing route: " + asset.id);
  }
  assert.doesNotMatch(systemHtml, /\bHarness\b|gpt-\d/i, "System home must stay vendor-neutral and model-neutral");
  assert.match(styleSource, /\.system-home\s*\{[\s\S]*?--system-max:\s*1184px/);
  const systemStyles = styleSource.slice(styleSource.indexOf("/* System home v2"));
  assert.doesNotMatch(systemStyles, /\bzoom\s*:|transform:\s*scale\(/, "System home must not fake 125% comfort with scaling");
  for (const entry of projectCatalog) {
    const overviewHtml = await readFile(path.join(projectRoot, "dist", ...entry.project.route.slice(1).split("/"), "index.html"), "utf8");
    for (const id of ["quick", "product", "technical"]) assert.ok(overviewHtml.includes(`data-project-reading-panel="${id}"`), `${entry.project.slug} omits reading layer: ${id}`);
    assert.match(overviewHtml, /class="module-index"/);
    assert.ok(overviewHtml.includes(entry.project.productPrinciples[0].title), `${entry.project.slug} omits its first product principle`);
    assert.match(overviewHtml, /class="document-section document-section-first project-positive-snapshot"/);
    for (const metric of entry.project.cardMetrics) {
      assert.ok(overviewHtml.includes(metric.label) && overviewHtml.includes(metric.value), `${entry.project.slug} quick layer omits card metric: ${metric.label}`);
    }
    assert.ok(overviewHtml.indexOf(entry.project.cardMetrics[0].value) < overviewHtml.indexOf("快照边界"), `${entry.project.slug} shows boundary before positive snapshot`);
    assert.ok(overviewHtml.indexOf("快照边界") < overviewHtml.indexOf("最快了解这个项目"), `${entry.project.slug} does not lead with snapshot and boundary`);
    assert.equal((overviewHtml.match(/project-headline-facts-technical/g) || []).length, 1, `${entry.project.slug} must render technical facts exactly once`);
    assert.doesNotMatch(overviewHtml, /project-headline-facts-quick/);
    const quickHtml = overviewHtml.slice(overviewHtml.indexOf('data-project-reading-panel="quick"'), overviewHtml.indexOf('data-project-reading-panel="product"'));
    const productHtml = overviewHtml.slice(overviewHtml.indexOf('data-project-reading-panel="product"'), overviewHtml.indexOf('data-project-reading-panel="technical"'));
    if (entry.project.gallery?.length) {
      const galleryClassPattern = /class="document-section project-gallery"/g;
      assert.equal((quickHtml.match(galleryClassPattern) || []).length, 1, `${entry.project.slug} gallery is not visible in Quick`);
      assert.equal((productHtml.match(galleryClassPattern) || []).length, 0, `${entry.project.slug} duplicates gallery in Product`);
      const galleryPosition = quickHtml.search(galleryClassPattern);
      assert.ok(quickHtml.indexOf("快照边界") < galleryPosition && galleryPosition < quickHtml.indexOf("最快了解这个项目"), `${entry.project.slug} gallery order drifted`);
    }
  }
  const skillsHtml = await readFile(path.join(projectRoot, "dist", "skills", "index.html"), "utf8");
  assert.match(skillsHtml, /data-skill-category="all"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-skill-category="all"/);
  const projectsHtml = await readFile(path.join(projectRoot, "dist", "projects", "index.html"), "utf8");
  assert.equal((projectsHtml.match(/class="project-card-state"/g) || []).length, projectCatalog.length);
  assert.equal((projectsHtml.match(/class="project-card-snapshot-boundary"/g) || []).length, projectCatalog.length);
  assert.equal((projectsHtml.match(/class="project-metrics"/g) || []).length, projectCatalog.length);
  for (const entry of projectCatalog) {
    for (const metric of entry.project.cardMetrics) assert.ok(projectsHtml.includes(metric.value), `project card omits metric: ${entry.project.slug}/${metric.label}`);
  }

  const searchAsset = await readFile(path.join(projectRoot, "dist", "search-index.js"), "utf8");
  const indexMatch = searchAsset.match(/^window\.__WLY_SEARCH_INDEX__=([\s\S]*);\s*$/);
  const compactIndex = JSON.parse(indexMatch[1]);
  const projectSearchAsset = await readFile(path.join(projectRoot, "dist", "search-projects.js"), "utf8");
  const projectIndexMatch = projectSearchAsset.match(/^window\.__WLY_PROJECT_SEARCH_INDEX__=([\s\S]*);\s*$/);
  const compactProjectIndex = JSON.parse(projectIndexMatch[1]);
  assert.equal(searchCompactEntries(compactIndex, "AI 如何协助工作", "system")[0]?.group, "系统", "System compact search is not available from the shared index");
  for (const domain of systemProjectDomains) {
    assert.equal(searchCompactEntries(compactIndex, domain.ordinaryRequest, "system")[0]?.title, domain.title, "System domain compact search misses: " + domain.id);
  }
  for (const projectName of [".agents", "PCConfig", "GitHub 总索引", "ChineseASR", "TimeAudit", "PC Panel Hub", "Codex Remote"]) {
    assert.equal(searchCompactEntries(compactIndex, projectName)[0]?.type, "项目", "System atlas outranks the exact project entry: " + projectName);
  }
  assert.equal(searchCompactEntries(compactIndex, "ProxyClean", "project")[0]?.href, "/#system-project-asset-proxy-clean");
  for (const moduleEntry of globalSearchEntries.filter((entry) => entry.type === "项目内容" && entry.aliases.length)) {
    const projectEntries = compactProjectIndex.filter((entry) => entry.projectSlug === moduleEntry.projectSlug);
    for (const alias of moduleEntry.aliases) {
      const match = searchCompactEntries([...compactIndex, ...projectEntries], alias, `project:${moduleEntry.projectSlug}`)[0];
      assert.equal(match?.title, moduleEntry.title, `project compact search loses: ${alias}`);
      assert.equal(match?.href, canonicalPath(new URL(moduleEntry.href, "https://wly0829.cn").pathname), `project compact search misroutes: ${alias}`);
    }
  }
  for (const [query, slug] of [["卡顿", "timeaudit"], ["电脑卡顿", "timeaudit"], ["游戏卡顿", "timeaudit"], ["Vault V2", "pcconfig"], ["银行卡盲填", "pcconfig"], ["waiting_for_codex_exit", "pcconfig"], ["SenseVoiceSmall", "chinese-asr"], ["Qwen3-ASR-1.7B", "chinese-asr"], ["真实任务能力验证", "cacb"], ["Fitbit一次授权", "personal-health"], ["decision_ready健康字段", "personal-health"], ["E95", "agents"]]) {
    assert.equal(searchCompactEntries(compactIndex, query, "project")[0]?.projectSlug, slug, `project compact search misroutes: ${query}`);
  }
});

test("route links use native directory documents and preserve module scroll without intercepting navigation", async () => {
  const pageSource = await readFile(path.join(projectRoot, "app", "page.jsx"), "utf8");
  const runtimeSource = await readFile(path.join(projectRoot, "static-site", "main.jsx"), "utf8");
  const rendererSource = await readFile(path.join(projectRoot, "server", "render-route.jsx"), "utf8");
  assert.match(pageSource, /const targetHref = internal[\s\S]*?canonicalPath\(target\.pathname\)/);
  assert.match(pageSource, /function SiteLink\(\{ href, onNavigate, preserveScroll = false/);
  const siteLinkSource = pageSource.slice(pageSource.indexOf("function SiteLink"), pageSource.indexOf("function SocialIcon"));
  assert.doesNotMatch(siteLinkSource, /preventDefault|pushState|PopStateEvent/, "directory links must remain native document navigation");
  assert.match(siteLinkSource, /data-preserve-scroll=\{preserveScroll \? "true" : undefined\}/);
  assert.match(pageSource, /function ProjectNav[\s\S]*?<SiteLink[^>]+preserveScroll[\s\S]*?currentModules\.map[\s\S]*?<SiteLink[\s\S]*?preserveScroll/);
  assert.match(pageSource, /<main id="main-content" ref=\{setMainRef\} tabIndex=\{-1\}>/);
  assert.match(runtimeSource, /const preservedScrollKey = "wly-route-scroll-v1"/);
  assert.match(runtimeSource, /const documentHref = \(value\) =>/);
  assert.match(runtimeSource, /targetDocument === documentHref\(window\.location\.href\)/);
  const likelyNextSource = rendererSource.slice(rendererSource.indexOf("function likelyNextRoutes"), rendererSource.indexOf("export function renderRoute"));
  assert.doesNotMatch(likelyNextSource, /"\/system"/);
  assert.match(runtimeSource, /record\.target !== currentTarget/);
  assert.match(runtimeSource, /Date\.now\(\) - record\.createdAt > 15000/);
  assert.match(runtimeSource, /window\.sessionStorage\.removeItem\(preservedScrollKey\)/);
  assert.match(runtimeSource, /frameCount < 12/);
  assert.match(runtimeSource, /window\.addEventListener\("load", restoreAfterLoad/);
  assert.match(runtimeSource, /document\.fonts\?\.ready/);
  assert.match(runtimeSource, /target: `\$\{target\.pathname\}\$\{target\.search\}`,[\s\S]*?scrollY: window\.scrollY/);
  assert.match(runtimeSource, /document\.addEventListener\("click"[\s\S]*?\{ capture: true \}/);
  assert.match(runtimeSource, /const previousY = window\.scrollY[\s\S]*?restoreReadingScroll\(previousY\)/);
  assert.match(pageSource, /href=\{`#project-reading-panel-\$\{layer\.id\}`\}/);
  const navCenterSource = runtimeSource.slice(runtimeSource.indexOf("function centerCurrentProjectNavigation"), runtimeSource.indexOf("document.documentElement.dataset.enhanced"));
  assert.match(navCenterSource, /querySelector\("\.project-navigation"\)/);
  assert.match(navCenterSource, /navigation\.scrollLeft = Math\.max/);
  assert.doesNotMatch(navCenterSource, /scrollIntoView/, "module nav centering must never overwrite restored window scrollY");
  assert.match(rendererSource, /rel="prefetch" as="document"/);
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
  assert.equal(panelSnapshot.skills.personalSelectedCount, skills.filter((item) => item.sourceKind === "personal_install" && item.availability === "available").length);
  assert.equal(panelSnapshot.skills.hostIntegratedCount, skills.filter((item) => item.sourceKind === "host_integrated" && item.availability === "available").length);
  assert.equal(panelSnapshot.skills.selectedPublicCount, panelSnapshot.skills.personalSelectedCount + panelSnapshot.skills.hostIntegratedCount);
  assert.equal(panelSnapshot.skills.activeInstallIntent - panelSnapshot.skills.personalSelectedCount, 2);
  assert.ok(Number.isInteger(panelSnapshot.skills.transactionCampaignCount) && panelSnapshot.skills.transactionCampaignCount >= panelSnapshot.skills.activeInstallIntent);
  assert.ok(skills.filter((item) => item.sourceKind === "personal_install").every((item) => item.transactionState.includes(`${panelSnapshot.skills.transactionCampaignCount} 个供应事务`)));
  assert.ok(skills.filter((item) => item.sourceKind === "host_integrated").every((item) => item.transactionState.includes("不经过个人 Skill 安装事务")));
  assert.ok(panelSnapshot.validation.rows.some((row) => row.layer.startsWith("Skill supply") && row.detail.includes(`${panelSnapshot.skills.activeInstallIntent} 个 personal active install intent`)));
  assert.equal(panelSnapshot.ruleBinding.length, 5);
  for (const binding of panelSnapshot.ruleBinding) {
    assert.match(binding.sourceSha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(binding.sourceBytes));
    assert.equal(typeof binding.sourceMatchesRelease, "boolean");
    assert.ok(binding.releasePath.includes(`E:\\.agents\\releases\\${panelSnapshot.authority.releaseId}\\`));
  }
});

test("E95 panel preserves continuity, trusted-local boundaries and attention quality", async () => {
  const bindings = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-rule-bindings.json"), "utf8"));
  const coreSource = await readFile(path.join(projectRoot, "app", "content-core.js"), "utf8");
  const ruleGuideSource = await readFile(path.join(projectRoot, "app", "content-rule-guides.js"), "utf8");
  assert.equal(bindings.semantic_release_id, "E95");
  assert.equal(bindings.ruleset_sha256, "b56847d29e1102945ffa437de0e58dfb79a887d4f0a606bfe1020b28746d8ef9");
  assert.equal(panelSnapshot.authority.releaseId, "E95");
  assert.equal(panelSnapshot.authority.gitCommit, "d32210b6594bf8ba1679da7b0f5bd66d18f3f6a7");
  assert.equal(panelSnapshot.authority.pointerRevision, 16);
  assert.equal(panelSnapshot.authority.previous.release_id, "E94");
  for (const expected of [
    "Durable explicit user authorization（耐久明确用户授权）",
    "root、全部 child/后代和新顶层任务",
    "真实调用一次",
    "deny、step_up、needs_evidence、action-time confirmation",
    "固定 Codex lifecycle resolver",
    "RecoverRelease / RecoverReleaseClaim",
    "threadId / clientThreadId",
    "Complete goal（已完成目标）",
    "正式 terminal/completed 且无 follow-up、queued work、pending transaction 或未交接 Owner residual 时才自动归档"
  ]) {
    assert.ok(coreSource.includes(expected), `E95 panel omits semantic contract: ${expected}`);
  }
  for (const expected of [
    "耐久明确授权跨任务持续",
    "已授权动作要真实调用一次",
    "项目不能降级长期授权",
    "真实调用一次而不是预判",
    "已有 Owner 先解析 lifecycle",
    "任务创建结果精确分类",
    "clean terminal 时用 RecoverRelease",
    "有 residual 才 RecoverReleaseClaim",
    "来源任务何时自动归档",
    "原生子代理与独立 Owner task 分层",
    "顶层任务默认 projectless"
  ]) {
    assert.ok(ruleGuideSource.includes(expected), `E95 rule guide omits: ${expected}`);
  }
  for (const expected of [
    "未归档且正式登记 long_term_task 的 Owner 不自动释放",
    "terminal long-term 只能由带 checkpoint/residual 的明确 successor 接续或正式 retirement",
    "归档任务仍无长期保留例外",
    "普通非长期，或已归档且 clean 的 predecessor",
    "未登记 long_term_task 的 inactive predecessor",
    "长期任务不自动释放"
  ]) {
    assert.ok(`${coreSource}\n${ruleGuideSource}`.includes(expected), `E95 long-term owner boundary omits: ${expected}`);
  }
  for (const expected of [
    "RecoverReleaseClaim 默认继承 predecessor 的非空 coordination",
    "Repartition 把当前 task 的冻结 coordination 写入全部 replacement bindings",
    "E94 修复 RecoverReleaseClaim 与 Repartition 的 coordination 延续"
  ]) {
    assert.ok(`${coreSource}\n${ruleGuideSource}`.includes(expected), `E95 coordination continuity omits: ${expected}`);
  }
  for (const expected of [
    "可信本地安全闭集",
    "安全标签不是复杂度额度",
    "注意力质量高于上下文数量",
    "实现盲测",
    "自然用户意图"
  ]) assert.ok(`${coreSource}\n${ruleGuideSource}`.includes(expected), `E95 product semantics omit: ${expected}`);
  assert.doesNotMatch(coreSource, /terminal long-term 无 residual 自动释放|终态旧 Owner 无残留时释放|terminal 无 residual 的 exact scope RecoverRelease|terminal Owner 无 residual 用 RecoverRelease|terminal 无残留逐 scope RecoverRelease|固定 resolver 证明 terminal 后，无 residual/);
  assert.doesNotMatch(ruleGuideSource, /平台准入时才创建|再原子 RecoverReleaseClaim/);
  const panelRefresh = skills.find((item) => item.slug === "personal-panel-refresh");
  const panelRefreshText = JSON.stringify({
    skill: panelRefresh,
    guide: skillGuides["personal-panel-refresh"],
    outcome: skillOutcomes["personal-panel-refresh"]
  });
  assert.ok(panelRefresh, "public personal-panel-refresh entry is missing");
  assert.doesNotMatch(
    panelRefreshText,
    /create_thread|threadId|clientThreadId|task_required|handoff|lifecycle|archive|projectless|dispatch-unconfirmed|setup-pending|successor|follow-up|任务 ID|派发回执|派发分类/i,
    "public personal-panel-refresh copy must not expose internal task bookkeeping"
  );
  for (const expected of [
    /来源项目.*发布.*正式回读/,
    /只有.*页面.*实质失真.*安排一次.*独立.*网站更新/,
    /告诉来源.*已经安排.*安排失败/,
    /来源.*立即继续/,
    /同一次.*不重复安排/,
    /不等待.*不轮询/,
    /网站负责人.*内容.*构建.*公开检查/,
    /正常推送.*现有 PUBLIC main.*Pages.*公网回读/,
    /安排失败.*不盲目重试/,
    /新公网目标.*付费.*秘密暴露.*force-push/
  ]) {
    assert.match(panelRefreshText, expected, `public personal-panel-refresh omits stable workflow semantics: ${expected}`);
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
  assert.ok(workflow.indexOf("run: npm run build") < workflow.indexOf("run: npm run test:built"));
  assert.ok(workflow.indexOf("run: npm run test:built") < workflow.indexOf("actions/upload-pages-artifact"));
  assert.ok(workflow.lastIndexOf("run: npm run verify:public") > workflow.indexOf("run: npm run test:built"));
  assert.ok(workflow.lastIndexOf("run: npm run verify:public") < workflow.indexOf("actions\/upload-pages-artifact"));
  assert.ok(workflow.indexOf("run: npm run build") < workflow.indexOf("actions\/upload-pages-artifact"));
  assert.match(verifier, /production_artifact_missing/);
  assert.match(verifier, /production_html_missing/);
  assert.match(verifier, /production_javascript_missing/);
  assert.match(verifier, /GitHub fine-grained token/);
  assert.match(verifier, /const secretPatterns/);
  assert.doesNotMatch(verifier, /forbiddenTerms|forbidden_public_term/);
  assert.doesNotMatch(verifier, /textExtensions/);
  assert.match(verifier, /core\.quotepath=false/);
  assert.match(verifier, /"-z"/);
  assert.match(verifier, /split\("\\0"\)/);
  assert.match(refresher, /const sourceRoot = "E:\\\\.agents"/);
  assert.match(refresher, /function publicSafeSourcePath/);
  assert.match(refresher, /Y29kZXg=/);
  assert.match(refresher, /Invoke-EAgentRulesRelease\.ps1/);
  assert.match(refresher, /e_rules_active_verified/);
  assert.doesNotMatch(refresher, /Get-ProtectedPolicyAuthorityStatus|policy_epoch|production_activation|candidate_pending/);
  assert.match(snapshotVerifier, /Invoke-EAgentRulesRelease\.ps1/);
  assert.match(snapshotVerifier, /process\.platform === "win32"/);
  assert.match(snapshotVerifier, /documentedRuleBindings\.semantic_release_id/);
  assert.match(snapshotVerifier, /snapshot_live_release_id_drift/);
  assert.match(snapshotVerifier, /snapshot_live_rule_descriptor_drift/);
  assert.doesNotMatch(refresher, /--source-root|--skip-tests|--offline/);
});

test("public content allows public-safe product names and excludes credential values", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const contentPaths = [...new Set([
    "app/page.jsx",
    "app/content-skills.js",
    "app/content-rule-guides.js",
    "app/site-content.js",
    "app/search.js",
    ...registry.projects.filter((item) => item.enabled).map((item) => item.ai_refresh.content_path)
  ])];
  const contentSources = await Promise.all(contentPaths.map((relative) => readFile(path.join(projectRoot, relative), "utf8")));
  const pageSource = contentSources[contentPaths.indexOf("app/page.jsx")];
  const publicText = contentSources.join("\n");
  assertNoCredentialValues(publicSafeProductAndDomainLabels.join("\n"));
  assertNoCredentialValues(publicText);
  assert.doesNotMatch(publicText, /sk-[A-Za-z0-9_-]{20,}/);
  assert.doesNotMatch(publicText, /gh[pousr]_[A-Za-z0-9]{20,}/);
  assert.doesNotMatch(publicText, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
  assert.doesNotMatch(publicText, /AIza[0-9A-Za-z_-]{30,}/);
  assert.doesNotMatch(publicText, /包装/, "public content source still uses rejected packaging language");
  assert.match(pageSource, /<form className="global-search-form" role="search" action="\/search\/" method="get">/);
  assert.match(pageSource, /className="search-scope-select" name="scope"/);
  assert.match(pageSource, /name="q"[\s\S]{0,100}aria-label=\{`在\$\{selectedScope\.label\}范围搜索关键词`\}/);
  assert.match(pageSource, /usesPartialAllIndex/);
  assert.match(pageSource, /查看完整搜索结果/);
  assert.doesNotMatch(pageSource, /addEventListener\("scroll"/);
  const publicMaintenanceLabels = /curated_packaging|manual_owner_only|manual-only|策展快照|策展展示|包装|手动维护/i;
  for (const route of routePaths) {
    const routeIndex = route === "/" ? path.join(projectRoot, "dist", "index.html") : path.join(projectRoot, "dist", ...route.slice(1).split("/"), "index.html");
    const html = await readFile(routeIndex, "utf8");
    assert.doesNotMatch(html, publicMaintenanceLabels, `${route} exposes website-maintenance language`);
  }
});

test("the public gate allows ordinary labels and blocks a constructed credential", async () => {
  const probeRoot = await mkdtemp(path.join(tmpdir(), "wly-public-gate-"));
  const probeScript = path.join(probeRoot, "scripts", "verify-public-content.mjs");
  const probeSource = path.join(probeRoot, "public-safe-labels.txt");
  try {
    await mkdir(path.join(probeRoot, "scripts"), { recursive: true });
    await mkdir(path.join(probeRoot, "dist", "assets"), { recursive: true });
    await copyFile(path.join(projectRoot, "scripts", "verify-public-content.mjs"), probeScript);
    await writeFile(path.join(probeRoot, "package.json"), '{"type":"module"}\n', "utf8");
    await writeFile(path.join(probeRoot, "dist", "index.html"), "<!doctype html><title>probe</title>", "utf8");
    await writeFile(path.join(probeRoot, "dist", "assets", "index.js"), "document.documentElement.dataset.probe='ok';\n", "utf8");
    await writeFile(probeSource, publicSafeProductAndDomainLabels.join("\n"), "utf8");
    execFileSync("git", ["init", "--quiet"], { cwd: probeRoot, windowsHide: true });

    const allowed = spawnSync(process.execPath, [probeScript], { cwd: probeRoot, encoding: "utf8", windowsHide: true });
    assert.equal(allowed.status, 0, allowed.stderr || allowed.stdout);
    assert.equal(JSON.parse(allowed.stdout).status, "pass");

    execFileSync("git", ["add", "public-safe-labels.txt"], { cwd: probeRoot, windowsHide: true });
    await rm(probeSource);
    const deleted = spawnSync(process.execPath, [probeScript], { cwd: probeRoot, encoding: "utf8", windowsHide: true });
    assert.equal(deleted.status, 0, "a tracked worktree deletion must not make the public gate read a nonexistent file");

    const fakeToken = `ghp_${"A".repeat(24)}`;
    await writeFile(probeSource, `${publicSafeProductAndDomainLabels.join("\n")}\n${fakeToken}\n`, "utf8");
    const blocked = spawnSync(process.execPath, [probeScript], { cwd: probeRoot, encoding: "utf8", windowsHide: true });
    assert.notEqual(blocked.status, 0, "constructed credential must block publication");
    const report = JSON.parse(blocked.stdout);
    assert.equal(report.status, "block");
    assert.ok(report.findings.some((item) => item.type === "credential_value" && item.pattern === "GitHub token"));
  } finally {
    await rm(probeRoot, { recursive: true, force: true });
  }
});

test("every public route is unique and has useful metadata", () => {
  assert.equal(new Set(routePaths).size, routePaths.length);
  assert.equal(routePaths.length, 6 + skills.length + projectCatalog.reduce((count, entry) => count + 1 + entry.modules.length, 0));
  for (const route of routePaths) {
    const meta = routeMeta(route);
    assert.match(meta.title, /吴乐阳/);
    assert.ok(meta.description.length >= 20, `${route} description is too short`);
    assert.ok(meta.description.length <= 220, `${route} description is too long`);
  }
  assert.ok(!routePaths.includes("/skills/nope/personal-media"));
  assert.match(routeMeta("/skills/nope/personal-media").title, /页面不存在/);
  assert.match(routeMeta("/projects/pcconfig/nope/machine-facts").title, /页面不存在/);
  assert.match(routeMeta("/projects/timeaudit/nope/collection-pipeline").title, /页面不存在/);
  assert.match(routeMeta("/projects/pc-panel-hub/nope/serial-transport").title, /页面不存在/);
  assert.match(routeMeta("/projects/cacb/nope/question-bank").title, /页面不存在/);
  assert.match(routeMeta("/projects/codex-remote/nope/same-task-control").title, /页面不存在/);
  assert.match(routeMeta("/projects/personal-health/nope/current-evidence-route").title, /页面不存在/);
});

test("production build has direct entry files for every route", async () => {
  const distRoot = path.join(projectRoot, "dist");
  await access(path.join(distRoot, "index.html"));
  for (const route of routePaths) {
    const routeIndex = route === "/"
      ? path.join(distRoot, "index.html")
      : path.join(distRoot, ...route.slice(1).split("/"), "index.html");
    const html = await readFile(routeIndex, "utf8");
    const rootStart = html.indexOf(`<div id="root" data-static-route="${route}">`);
    const rootEnd = html.indexOf("<noscript>", rootStart);
    assert.ok(rootStart >= 0 && rootEnd > rootStart, `${route} has no route-specific static root`);
    const rootHtml = html.slice(rootStart, rootEnd);
    assert.ok(rootHtml.length >= 2000, `${route} static root is an empty shell`);
    assert.match(rootHtml, /<main id="main-content"/);
    assert.doesNotMatch(rootHtml, /<div id="root"><\/div>/);

    if (route === "/") {
      assert.match(rootHtml, /class="system-home"/);
      assert.ok(rootHtml.includes(systemHomeHero.title), "System home omits its product promise");
    } else if (route === "/projects") {
      assert.match(rootHtml, /class="page-frame home-page"/);
      for (const entry of projectCatalog) assert.ok(rootHtml.includes(entry.project.title), `projects index omits ${entry.project.title}`);
    } else {
      const projectEntry = projectCatalog.find((entry) => route === entry.project.route || route.startsWith(`${entry.project.route}/`));
      if (projectEntry) {
        assert.ok(rootHtml.includes(projectEntry.project.title), `${route} omits its project identity`);
        if (route === projectEntry.project.route) assert.match(rootHtml, /class="document-content overview-content"/);
        else {
          const module = projectEntry.modules.find((item) => route === `${projectEntry.project.route}/${item.slug}`);
          const titleFragments = module?.title.match(/\p{Script=Han}{2,}/gu) || [];
          assert.ok(module && titleFragments.length && titleFragments.every((fragment) => rootHtml.includes(fragment)), `${route} omits its module core`);
          assert.match(rootHtml, /class="document-content module-detail"/);
        }
      } else if (route === "/rules") {
        assert.match(rootHtml, /class="rules-workbench"/);
        for (const rule of rulesSnapshot.rules) assert.ok(rootHtml.includes(`data-rule-panel="${rule.logicalId}"`), `rules HTML omits ${rule.logicalId}`);
      } else if (route === "/system") {
        assert.match(rootHtml, /class="system-home"/);
      } else if (route === "/search") {
        assert.match(rootHtml, /class="page-frame search-results-page"/);
      } else if (route === "/skills") {
        assert.match(rootHtml, /class="skill-directory"/);
        assert.ok(rootHtml.includes(skills[0].name) && rootHtml.includes(skills.at(-1).name), "Skills directory is incomplete");
      } else if (route.startsWith("/skills/")) {
        const item = skills.find((candidate) => route === `/skills/${candidate.slug}`);
        assert.ok(item && rootHtml.includes(item.name), `${route} omits its Skill core`);
        assert.match(rootHtml, /class="standalone-document skill-document"/);
      }
    }
    assert.ok(html.includes(`<link rel="canonical" href="${expectedCanonicalUrl(route)}" />`), `${route} canonical drifted`);
    if (route === "/system") assert.match(html, /<meta http-equiv="refresh" content="0; url=\/" \/>/);
    const staticPrefetches = html.match(/<link rel="prefetch" as="document" href="\/[^"]*" \/>/g) || [];
    assert.ok(staticPrefetches.length <= 1, `${route} emits more than one static document prefetch`);
    if (route === "/system") assert.equal(staticPrefetches.length, 0, "compatibility redirect must not prefetch another route");
    assert.match(html, /<script src="\/search-index\.js"><\/script>/);
    const routeProject = projectCatalog.find((entry) => route === entry.project.route || route.startsWith(`${entry.project.route}/`));
    if (route === "/search") {
      assert.match(html, /<script src="\/search-projects\.js"><\/script>/, "full search route must load every project module index");
      assert.doesNotMatch(html, /<script src="\/search-project-[^"]+\.js"><\/script>/, "full search route must not also load a per-project index");
    } else if (routeProject) {
      assert.match(html, new RegExp(`<script src="/search-project-${routeProject.project.slug}\\.js"></script>`), `${route} does not load its project search index`);
      assert.doesNotMatch(html, /<script src="\/search-projects\.js"><\/script>/, `${route} must not load every project's module index`);
    } else {
      assert.doesNotMatch(html, /<script src="\/search-projects\.js"><\/script>|<script src="\/search-project-[^"]+\.js"><\/script>/, `${route} loads a project module index outside a project context`);
    }
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
    assert.ok(html.includes(`<link rel="canonical" href="${expectedCanonicalUrl(route)}" />`), `${route} canonical drifted`);
    assert.ok(html.includes(`<meta property="og:url" content="${expectedCanonicalUrl(route)}" />`), `${route} Open Graph URL drifted`);
    assert.ok(html.includes(`<meta property="og:title" content="${escapeAttribute(meta.title)}" />`), `${route} Open Graph title drifted`);
    assert.ok(html.includes(`<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`), `${route} Twitter title drifted`);
  }
  const sitemap = await readFile(path.join(distRoot, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<url>/g) || []).length, routePaths.length - 1);
  for (const route of routePaths.filter((candidate) => candidate !== "/system")) assert.ok(sitemap.includes(`<loc>${canonicalUrl(route)}</loc>`));
  const robots = await readFile(path.join(projectRoot, "public", "robots.txt"), "utf8");
  const favicon = await readFile(path.join(projectRoot, "public", "favicon.svg"), "utf8");
  const rootHtml = await readFile(path.join(projectRoot, "static-site", "index.html"), "utf8");
  const notFoundHtml = await readFile(path.join(projectRoot, "public", "404.html"), "utf8");
  assert.match(rootHtml, /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml" \/>/);
  assert.match(notFoundHtml, /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml" \/>/);
  assert.match(favicon, /viewBox="0 0 64 64"/);
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Sitemap: https:\/\/wly0829\.cn\/sitemap\.xml/);
  const notFound = await readFile(path.join(projectRoot, "public", "404.html"), "utf8");
  assert.match(notFound, /<meta name="robots" content="noindex, follow"/);
  assert.match(notFound, /href="\/projects\/">查看项目/);
  assert.doesNotMatch(notFound, /body\s*\{[^}]*min-width:\s*320px/);
  assert.doesNotMatch(notFound, /<footer|WLY0829\.CN/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { personalExpressionModules, personalExpressionProject } from "../app/content-personal-expression.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = [
  "explain-to-me",
  "reply-as-me",
  "feedback-consolidation-and-lessons-sync",
  "corpus-extension-and-private-recovery"
];

test("personal-expression integrates as its own private-source package at rank 34", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config/panel-projects.json"), "utf8"));
  const plan = JSON.parse(await readFile(path.join(projectRoot, "config/final-project-order.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "personal-expression");
  assert.ok(registration);
  assert.equal(registration.enabled, true);
  assert.equal(registration.order, 34);
  assert.equal(registration.route, personalExpressionProject.route);
  assert.equal(registration.ai_refresh.content_path, "app/content-personal-expression.js");
  assert.equal(registration.source.repo, "wlyaaaaa/personal-expression");
  assert.equal(registration.source.visibility, "PRIVATE");
  assert.equal(registration.source.default_branch, "main");
  assert.equal(plan.projects.find((item) => item.id === "personal-expression")?.final_rank, 34);
  assert.ok(projectCatalog.some((item) => item.project.slug === "personal-expression"));
  // Registration and plan state are local integration facts, never proof of deployment.
});

test("personal-expression preserves all four direct module routes", () => {
  assert.deepEqual(personalExpressionModules.map((item) => item.slug), moduleSlugs);
  assert.ok(routePaths.includes(personalExpressionProject.route));
  for (const slug of moduleSlugs) {
    assert.ok(routePaths.includes(`${personalExpressionProject.route}/${slug}`), `missing route: ${slug}`);
  }
  assert.deepEqual(new Set(personalExpressionProject.usageExamples.map((item) => item.moduleSlug)), new Set(moduleSlugs));
});

test("personal-expression provides reader content and renders every glossary meaning", async () => {
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof personalExpressionProject[field], "string");
    assert.notEqual(personalExpressionProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "operatingFlow", "operationalEntrypoints", "productPrinciples"]) {
    assert.ok(personalExpressionProject[field].length > 0, `missing ${field}`);
  }
  const html = await readFile(path.join(projectRoot, "dist/projects/personal-expression/index.html"), "utf8");
  for (const item of personalExpressionProject.glossary) {
    assert.ok(item.term && item.meaning, "the shared renderer reads glossary.meaning");
    assert.ok(html.includes(item.meaning), `rendered glossary lost the meaning of ${item.term}`);
  }
  assert.ok(html.includes("expression.py 的 main（命令行入口函数）"));
  assert.ok(!html.includes("expression.py 的 main（默认主分支）"));
  for (const module of personalExpressionModules) {
    for (const field of ["value", "why", "example", "result", "problem", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug}.${field}`);
      assert.notEqual(module[field].trim(), "");
    }
    for (const field of ["decisionImpact", "implementation", "flow", "concepts", "boundaries", "failures", "sources", "verification"]) {
      assert.ok(module[field].length > 0, `${module.slug}.${field}`);
    }
    assert.equal(module.stateLabels.length, 3);
    for (const state of ["pass", "problem", "unavailable"]) assert.ok(module.readerStates[state]);
  }
  // These structural checks support, but do not replace, source-first semantic acceptance.
});

test("personal-expression distinguishes verified source from untested personal outcomes", () => {
  const snapshot = personalExpressionProject.currentSnapshot;
  assert.ok(Number.isFinite(Date.parse(snapshot.observedAt)));
  assert.ok(snapshot.facts.some((item) => item.value.includes("9b174a94375119ee7578b5eb4eaa8e74dabc33f5")));
  assert.ok(snapshot.gaps.some((item) => item.includes("后续真实任务") && item.includes("实际使用验收")));
  assert.ok(snapshot.gaps.some((item) => item.includes("真实微信动画") && item.includes("未完成验收")));
  assert.ok(snapshot.gaps.some((item) => item.includes("换机恢复") && item.includes("未进行")));
  assert.ok(personalExpressionProject.evidenceLayers.every((item) => item.proves && item.doesNotProve));
  assert.equal(personalExpressionProject.visibility, "私有仓库");
  assert.equal(personalExpressionProject.repositoryUrl, undefined);
});

test("personal-expression technical reference retains the four actual reader commands", () => {
  const commands = personalExpressionProject.operationalEntrypoints.map((item) => item.command);
  for (const command of ["python expression.py explain", "python expression.py scenes", "python expression.py validate", "python expression.py --data-root data-backup validate"]) {
    assert.ok(commands.includes(command), `missing ${command}`);
  }
  assert.ok(commands.some((command) => command.startsWith("python expression.py reply --scene ")));
  const contracts = personalExpressionProject.technicalContracts;
  assert.ok(contracts.some((item) => item.artifact === "reply 输出 examples" && item.boundary.includes("不是自动脱敏")));
  assert.ok(contracts.some((item) => item.artifact === "reply-samples.jsonl" && item.boundary.includes("标签合法不证明实际作者正确")));
  assert.ok(contracts.some((item) => item.owner === "expression.py 的 main（命令行入口函数）"));
});

test("personal-expression search connects ordinary requests to their owning references", () => {
  const cases = [
    ["这段我没听懂，结合我的情况讲清楚", "explain-to-me"],
    ["帮我把已经定好的回复写自然", "reply-as-me"],
    ["怎样让表达纠正下次还用得上", "feedback-consolidation-and-lessons-sync"],
    ["换机怎样读取个人表达备份", "corpus-extension-and-private-recovery"]
  ];
  for (const [query, slug] of cases) {
    const results = searchPanel(query);
    assert.ok(results.some((item) => item.href === `${personalExpressionProject.route}/${slug}`), `missing owning module for ${query}`);
  }
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { project, modules } from "../app/content-llm-backend-toolkit.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

test("Toolkit is integrated at its fixed rank with all owning routes", async () => {
  const registry = JSON.parse(await readFile(new URL("../config/panel-projects.json", import.meta.url), "utf8"));
  const entry = registry.projects.find((item) => item.id === project.slug);
  assert.equal(project.order, 24);
  assert.equal(entry.order, 24);
  assert.equal(entry.source.repo, "wlyaaaaa/llm-backend-toolkit");
  assert.equal(entry.source.default_branch, "main");
  assert.ok(projectCatalog.some((item) => item.project.slug === project.slug));
  assert.ok(routePaths.includes(project.route));
  const slugs = new Set(modules.map((item) => item.slug));
  assert.equal(slugs.size, modules.length);
  for (const module of modules) assert.ok(routePaths.includes(module.route));
  for (const usage of project.usageExamples) assert.ok(slugs.has(usage.moduleSlug));
});

test("Toolkit natural requests reach its task and material explanations", () => {
  for (const query of ["把一份长材料交给本地模型，稍后取结果", "材料太长只读相关段落，再继续问一次", "模型调用观察台看公开进度"]) {
    assert.ok(searchPanel(query).some((item) => item.href.startsWith(project.route)), query);
  }
});

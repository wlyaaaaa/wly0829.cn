import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { project, modules } from "../app/content-codex-app-power-user-playbook.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

test("Playbook keeps master identity and its fixed rank with all module routes", async () => {
  const registry = JSON.parse(await readFile(new URL("../config/panel-projects.json", import.meta.url), "utf8"));
  const entry = registry.projects.find((item) => item.id === project.slug);
  assert.equal(project.order, 27);
  assert.equal(entry.order, 27);
  assert.equal(entry.source.default_branch, "master");
  assert.equal(entry.source.repo, "wlyaaaaa/codex-app-power-user-playbook");
  assert.ok(projectCatalog.some((item) => item.project.slug === project.slug));
  assert.ok(routePaths.includes(project.route));
  const slugs = new Set(modules.map((item) => item.slug));
  assert.equal(slugs.size, modules.length);
  for (const module of modules) assert.ok(routePaths.includes(module.route));
  for (const usage of project.usageExamples) assert.ok(slugs.has(usage.moduleSlug));
});

test("Playbook natural requests find reusable methods and its PDF example", () => {
  for (const query of ["Codex 实践手册 AGENTS 模板", "Codex 运行目录和长期规则源码分开保存", "中文空格文件名导出 PDF 示例"]) {
    assert.ok(searchPanel(query).some((item) => item.href.startsWith(project.route)), query);
  }
});

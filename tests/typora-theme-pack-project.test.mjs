import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { project, modules } from "../app/content-typora-theme-pack.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

test("Typora pack uses the fixed rank and all existing module routes", async () => {
  const registry = JSON.parse(await readFile(new URL("../config/panel-projects.json", import.meta.url), "utf8"));
  const entry = registry.projects.find((item) => item.id === project.slug);
  assert.equal(project.order, 25);
  assert.equal(entry.order, 25);
  assert.equal(entry.source.repo, "wlyaaaaa/typora-theme-pack");
  assert.ok(projectCatalog.some((item) => item.project.slug === project.slug));
  assert.ok(routePaths.includes(project.route));
  const slugs = new Set(modules.map((item) => item.slug));
  assert.equal(slugs.size, modules.length);
  for (const module of modules) assert.ok(routePaths.includes(module.route));
  for (const usage of project.usageExamples) assert.ok(slugs.has(usage.moduleSlug));
});

test("Typora actual PDF gallery points to local PNG artifacts with evidence boundaries", async () => {
  assert.equal(project.gallery.length, 3);
  for (const item of project.gallery) {
    const bytes = await readFile(new URL(`../public${item.src}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.ok(item.proves && item.doesNotProve && item.observedAt);
  }
});

test("Typora natural requests find theme and document delivery", () => {
  for (const query of ["Typora 安装薄荷绿主题", "同一份 Markdown 给自己和同事导出不同 PDF", "导出失败保留旧 PDF"]) {
    assert.ok(searchPanel(query).some((item) => item.href.startsWith(project.route)), query);
  }
});

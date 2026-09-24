import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { project, modules } from "../app/content-steam-millennium-config-backup.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Steam Millennium keeps its source identity, rank and enabled route together", async () => {
  const registry = JSON.parse(await readFile(path.join(root, "config/panel-projects.json"), "utf8"));
  const plan = JSON.parse(await readFile(path.join(root, "config/final-project-order.json"), "utf8"));
  const entry = registry.projects.find(({ id }) => id === project.slug);
  assert.ok(entry, "missing completed Steam Millennium registration");
  const planned = plan.projects.find(({ id }) => id === project.slug);
  assert.ok(planned);
  assert.equal(entry.order, planned.final_rank);
  assert.equal(entry.order, project.order);
  assert.equal(entry.enabled, true);
  assert.equal(entry.route, project.route);
  assert.equal(entry.ai_refresh.content_path, "app/content-steam-millennium-config-backup.js");
  assert.deepEqual(entry.source, {
    repo: "wlyaaaaa/steam-millennium-config-backup",
    visibility: "PUBLIC",
    default_branch: "master",
    local_root: "E:\\Projects\\Tools\\steam-millennium-config-backup"
  });
  assert.equal(planned.state, "published");
  assert.ok(projectCatalog.some(({ project: item }) => item.slug === project.slug));
});

test("Steam Millennium overview and every owned module have complete static documents", async () => {
  const paths = [project.route, ...modules.map(({ slug }) => `${project.route}/${slug}`)];
  assert.equal(new Set(paths).size, paths.length);
  for (const route of paths) {
    assert.ok(routePaths.includes(route), `unregistered route ${route}`);
    const html = await readFile(path.join(root, "dist", route.slice(1), "index.html"), "utf8");
    assert.ok(html.includes("Steam Millennium"), `missing static project content ${route}`);
    assert.match(html, /<main[\s>]/);
    assert.ok(!html.includes("/projects/codex-app-power-user-playbook"));
  }
  const overview = await readFile(path.join(root, "dist", project.route.slice(1), "index.html"), "utf8");
  assert.ok(overview.includes("5c65e9499b076ba745d9fe9358d7a72bd7cb2151"));
  assert.match(overview, /20个配置文件/);
  assert.match(overview, /millennium.snapshot.v2/);
  assert.match(overview, /多文件事务/);
  assert.match(overview, /不是整个文件系统/);
  assert.match(overview, /RestorePlan/);
  assert.match(overview, /Rollback/);
  assert.ok(overview.includes("重新安装后的版本和资源必须"));
});

test("ordinary Steam backup and recovery searches reach this project within the first three results", () => {
  for (const query of [
    "重装电脑想恢复 Steam Millennium 的主题和插件设置",
    "Steam 的绿色和细滚动条怎么找回来",
    "Zehn 当前安装和备份版本不同",
    "Millennium 最近有没有自动备份"
  ]) {
    const results = searchPanel(query).slice(0, 3);
    assert.ok(results.some(({ href }) => href === project.route || href.startsWith(`${project.route}/`)),
      `owning project absent for ${query}: ${results.map(({ href }) => href).join(", ")}`);
  }
});

test("Steam Millennium stays reachable from its own project route without restoring a duplicate System directory", () => {
  assert.ok(routePaths.includes(project.route));
});

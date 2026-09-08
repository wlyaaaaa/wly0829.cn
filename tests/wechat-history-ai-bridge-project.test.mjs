import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { project, modules } from "../app/content-wechat-history-ai-bridge.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

const root = new URL("../", import.meta.url);
const readJson = async (relative) => JSON.parse(await readFile(new URL(relative, root), "utf8"));

test("WeFlow bridge registration preserves source identity and rank 27", async () => {
  const registry = await readJson("config/panel-projects.json");
  const plan = await readJson("config/final-project-order.json");
  const registered = registry.projects.find((item) => item.id === project.slug);
  assert.ok(registered?.enabled);
  assert.equal(registered.order, 27);
  assert.equal(registered.route, project.route);
  assert.equal(registered.ai_refresh.content_path, "app/content-wechat-history-ai-bridge.js");
  assert.deepEqual(registered.source, {
    repo: "wlyaaaaa/wechat-history-ai-bridge",
    visibility: "PUBLIC",
    default_branch: "master",
    local_root: "E:\\Projects\\Tools\\WeFlowBridge"
  });
  const planned = plan.projects.find((item) => item.id === project.slug);
  assert.equal(planned?.final_rank, 27);
  assert.equal(planned?.state, "published");
  assert.ok(projectCatalog.some((entry) => entry.project.slug === project.slug));
});

test("WeFlow bridge overview and all owned references are navigable", () => {
  assert.ok(routePaths.includes(project.route));
  const owned = new Set(modules.map((entry) => entry.slug));
  assert.equal(owned.size, modules.length);
  for (const entry of modules) {
    assert.ok(routePaths.includes(`${project.route}/${entry.slug}`));
  }
  for (const example of project.usageExamples) {
    assert.ok(owned.has(example.moduleSlug), `orphan example: ${example.ask}`);
  }
});

test("WeFlow-specific natural searches reach the project and its references", () => {
  for (const query of [
    "WeFlow 群聊的回复引用怎么保留",
    "WeFlow 一到后台检查就闪黑框",
    "WeFlow MetadataOnly 需要凭据吗",
    "WeFlow 已经导出的文件怎样检查哈希"
  ]) {
    const results = searchPanel(query);
    assert.ok(results.slice(0, 8).some((item) => item.href.startsWith(project.route)),
      `${query}: ${results.slice(0, 3).map((item) => item.href).join(", ")}`);
  }
});

test("WeFlow current evidence distinguishes health, synthetic tests and real data", () => {
  assert.ok(Number.isFinite(Date.parse(project.currentSnapshot.observedAt)));
  assert.match(project.currentSnapshot.boundary, /未验证真实聊天读取/);
  assert.match(project.currentState.facts.join("\n"), /7510c29ae3a95b36363b4d6ba2d1c47c4e602f85/);
  assert.match(project.currentState.gaps.join("\n"), /没有数字签名/);
  assert.match(project.currentState.gaps.join("\n"), /不是本仓库实现的 HTTP 拦截器/);
  assert.ok(project.evidenceLayers.every((entry) => entry.proves && entry.doesNotProve));
});

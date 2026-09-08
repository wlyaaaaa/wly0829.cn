import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { ramdiskGuardianProject as project, ramdiskGuardianModules as modules } from "../app/content-ramdisk-guardian.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceCommit = "c12821ac26c0ede830d8ddb1cbc00d56e57dbdb3";

test("RamdiskGuardian keeps its real source identity and rank 31 after retirement renumbering", async () => {
  const registry = JSON.parse(await readFile(path.join(root, "config/panel-projects.json"), "utf8"));
  const plan = JSON.parse(await readFile(path.join(root, "config/final-project-order.json"), "utf8"));
  const entry = registry.projects.find((item) => item.id === "ramdisk-guardian");
  assert.ok(entry?.enabled);
  assert.equal(entry.order, 31);
  assert.equal(entry.source.repo, "wlyaaaaa/RamdiskGuardian");
  assert.equal(entry.source.visibility, "PUBLIC");
  assert.equal(entry.source.default_branch, "main");
  assert.equal(entry.source.local_root, "E:\\Projects\\Tools\\RamdiskGuardian");
  assert.equal(entry.ai_refresh.content_path, "app/content-ramdisk-guardian.js");
  assert.equal(plan.projects.find((item) => item.id === entry.id)?.state, "published");
  assert.equal(projectCatalog.find((item) => item.project.slug === entry.id)?.project.order, 31);
});

test("all five source-backed RamdiskGuardian axes have direct routes and linked ordinary uses", () => {
  assert.deepEqual(modules.map((item) => item.slug), [
    "volatile-cache-contract-and-backup-retirement",
    "drive-arrival-sensing-and-skeleton-healing",
    "host-memory-telemetry-and-silent-monitoring",
    "unaccounted-watchdog-and-driver-auto-release",
    "installation-and-application-recovery"
  ]);
  assert.ok(routePaths.includes(project.route));
  for (const module of modules) {
    assert.ok(routePaths.includes(`${project.route}/${module.slug}`));
    assert.ok(project.usageExamples.some((example) => example.moduleSlug === module.slug));
  }
  const domain = systemProjectDomains.find((item) => item.id === "machine-and-remote");
  assert.equal(domain.assets.find((item) => item.id === project.slug)?.href, project.route);
});

test("snapshot keeps current OK and historical WARN separate from task success and unperformed recovery", () => {
  assert.equal(project.currentState.observedAt, project.currentSnapshot.observedAt);
  assert.deepEqual(project.cardMetrics, project.currentSnapshot.metrics);
  assert.match(project.cardStatus, /自然巡检OK/);
  const facts = project.currentSnapshot.facts.map((item) => item.value).join("\n");
  assert.ok(facts.includes(sourceCommit));
  assert.match(facts, /12个明确目录/);
  assert.match(facts, /08:07:32Z为OK：提交余量9.3GiB/);
  assert.match(facts, /03:37Z的低余量WARN已不再是本轮状态/);
  assert.match(facts, /10个隔离恢复场景/);
  assert.match(project.snapshotBoundary, /没有重建实盘或重启/);
  assert.ok(project.currentSnapshot.gaps.some((gap) => gap.includes("使用约定") && gap.includes("误放")));
  const recovery = modules.find((item) => item.slug === "unaccounted-watchdog-and-driver-auto-release");
  assert.ok(recovery.failures.some((item) => item.condition === "init失败" && item.response.includes("不调用save")));
  assert.ok(recovery.boundaries.some((text) => text.includes("不意味着所有前步骤已回滚")));
});

test("ordinary cache and installation searches reach the RamdiskGuardian pages", () => {
  for (const query of ["Z盘应该放什么缓存", "内存盘WARN别弹窗", "Primo删除缓存后内存不释放", "恢复RamdiskGuardian计划任务"]) {
    const results = searchPanel(query);
    assert.ok(results.slice(0, 5).some((item) => item.href.startsWith(project.route)),
      `No RamdiskGuardian result in first five for ${query}: ${results.slice(0, 5).map((item) => item.href).join(", ")}`);
  }
});

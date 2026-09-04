import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { videoScaffoldModules, videoScaffoldProject } from "../app/content-video-scaffold.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "project-bootstrap",
  "voice-timing",
  "scene-authoring",
  "preflight-preview",
  "deterministic-render",
  "delivery-verify",
  "recovery-reuse"
];

test("video-scaffold is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "video-scaffold");
  assert.ok(registration, "video-scaffold registry entry is missing");
  assert.deepEqual(
    {
      id: registration.id,
      title: registration.title,
      enabled: registration.enabled,
      presentation_mode: registration.presentation_mode,
      route: registration.route,
      content_path: registration.ai_refresh.content_path,
      repo: registration.source.repo,
      visibility: registration.source.visibility,
      default_branch: registration.source.default_branch,
      local_root: registration.source.local_root
    },
    {
      id: "video-scaffold",
      title: "video-scaffold",
      enabled: true,
      presentation_mode: "real_dashboard",
      route: "/projects/video-scaffold",
      content_path: "app/content-video-scaffold.js",
      repo: "wlyaaaaa/video-scaffold",
      visibility: "PUBLIC",
      default_branch: "main",
      local_root: "E:\\Projects\\Archives\\video-scaffold"
    }
  );
  assert.equal(videoScaffoldProject.slug, registration.id);
  assert.equal(videoScaffoldProject.order, registration.order);
  assert.ok(projectCatalog.some((entry) => entry.project.slug === "video-scaffold"));
});

test("video-scaffold exposes seven source-backed modules and all three reading layers", async () => {
  assert.deepEqual(videoScaffoldModules.map((item) => item.slug), expectedModuleSlugs);
  assert.ok(routePaths.includes(videoScaffoldProject.route));
  for (const slug of expectedModuleSlugs) {
    assert.ok(routePaths.includes(`${videoScaffoldProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof videoScaffoldProject[field], "string");
    assert.notEqual(videoScaffoldProject[field].trim(), "");
  }
  for (const field of ["components", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples"]) {
    assert.ok(Array.isArray(videoScaffoldProject[field]) && videoScaffoldProject[field].length > 0, `missing project field: ${field}`);
  }
  for (const module of videoScaffoldModules) {
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug} missing ${field}`);
      assert.notEqual(module[field].trim(), "");
    }
  }
  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "video-scaffold", "index.html"), "utf8");
  for (const layer of ["quick", "product", "technical"]) {
    assert.match(overviewHtml, new RegExp(`data-project-reading-panel="${layer}"`));
  }
});

test("video-scaffold snapshot separates verified source and environment from an unrun full video", () => {
  const snapshot = videoScaffoldProject.currentSnapshot;
  assert.deepEqual(videoScaffoldProject.cardMetrics, snapshot.metrics.map(({ label, value }) => ({ label, value })));
  assert.deepEqual(videoScaffoldProject.heroFacts, snapshot.facts.filter((fact) => fact.hero).map(({ label, value }) => ({ label, value })));
  const text = JSON.stringify({ project: videoScaffoldProject, modules: videoScaffoldModules });
  for (const expected of ["17040edc0a8f5b2a26116e204d1705cb5d6490ed", "33 / 33", "10 / 10", "3840×2160", "60fps", "s2.1-pro-free", "large-v3", "audio_NN.identity.json", "durations.json.identity.json", "file:///", "final_output.mp4", "没有调用 doctor-live", "没有从脚本走到 final_output.mp4"]) {
    assert.ok(text.includes(expected), `video-scaffold omits current evidence or boundary: ${expected}`);
  }
  assert.match(text, /环境就绪.*完整视频完成|环境体检.*不是成片/s);
  assert.match(text, /不自动.*选题|不替我决定选题/s);
});

test("video-scaffold module search is explicit and natural requests reach the owning routes", async () => {
  const keys = ["entities", "failureRecovery", "intents", "relations"];
  for (const module of videoScaffoldModules) {
    assert.deepEqual(Object.keys(module.searchProjection).sort(), keys);
    for (const key of keys) assert.ok(module.searchProjection[key].length > 0, `${module.slug}.${key} is empty`);
  }
  const cases = [
    ["旁白改了为什么还在用旧音频", "/projects/video-scaffold/voice-timing"],
    ["素材换了怎么避免混入旧渲染分片", "/projects/video-scaffold/deterministic-render"],
    ["视频做好封面章节后怎么验收", "/projects/video-scaffold/delivery-verify"],
    ["视频渲染前先看所有动画和文字越界", "/projects/video-scaffold/preflight-preview"]
  ];
  for (const [query, href] of cases) {
    assert.ok(searchPanel(query).slice(0, 5).some((entry) => entry.href === href), `search misses ${query}`);
  }
  const asset = await readFile(path.join(projectRoot, "dist", "search-project-video-scaffold.js"), "utf8");
  const match = asset.match(/^window\.__WLY_PROJECT_SEARCH_INDEX__=([\s\S]*);\s*$/);
  assert.ok(match);
  assert.deepEqual(JSON.parse(match[1]).map((item) => item.href), expectedModuleSlugs.map((slug) => `/projects/video-scaffold/${slug}/`));
});

test("System links its existing video-scaffold asset to the new detail page", () => {
  const asset = systemProjectDomains.flatMap((domain) => domain.assets).find((item) => item.id === "video-scaffold");
  assert.ok(asset);
  assert.equal(asset.href, "/projects/video-scaffold");
  assert.match(asset.role, /词级时间轴.*SVG.*4K60.*续作/);
});

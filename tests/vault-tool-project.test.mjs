import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { vaultToolModules, vaultToolProject } from "../app/content-vault-tool.js";
import { projectCatalog, projects, routePaths } from "../app/site-content.js";
import { skillProjectLinks } from "../app/content-capability-links.js";
import { searchPanel } from "../app/search.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "files-encryption",
  "view-extract",
  "passwords-formats",
  "maintenance-recovery",
  "dual-password",
  "image-carrier",
  "ai-local-interface",
  "private-backup"
];
const snapshotSourcePath = path.join(projectRoot, "app", "content-vault-tool.js");

test("vault-tool is registered as the eighteenth public project with its source identity", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "vault-tool");
  assert.ok(registration, "vault-tool registry entry is missing");
  assert.deepEqual(
    {
      id: registration.id,
      order: registration.order,
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
      id: "vault-tool",
      order: 18,
      title: "vault-tool",
      enabled: true,
      presentation_mode: "real_dashboard",
      route: "/projects/vault-tool",
      content_path: "app/content-vault-tool.js",
      repo: "wlyaaaaa/vault-tool",
      visibility: "PUBLIC",
      default_branch: "main",
      local_root: "E:\\Projects\\Tools\\vault-tool"
    }
  );
  assert.equal(vaultToolProject.slug, registration.id);
  assert.equal(vaultToolProject.order, registration.order);
  assert.equal(vaultToolProject.route, registration.route);
  assert.equal(projectCatalog.at(-1)?.project.slug, "vault-tool");
});

test("vault-tool keeps eight independent module routes and all three reading layers", async () => {
  assert.deepEqual(vaultToolModules.map((item) => item.slug), expectedModuleSlugs);
  assert.equal(new Set(expectedModuleSlugs).size, 8);
  assert.equal(vaultToolProject.order, 18);
  assert.equal(vaultToolProject.route, "/projects/vault-tool");
  assert.ok(routePaths.includes(vaultToolProject.route), "vault-tool overview route is missing");

  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof vaultToolProject[field], "string", `vault-tool ${field} is missing`);
    assert.notEqual(vaultToolProject[field].trim(), "", `vault-tool ${field} is empty`);
  }
  for (const field of ["components", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples"]) {
    assert.ok(Array.isArray(vaultToolProject[field]) && vaultToolProject[field].length > 0, `vault-tool ${field} is missing`);
  }

  for (const module of vaultToolModules) {
    assert.ok(routePaths.includes(`${vaultToolProject.route}/${module.slug}`), `vault-tool route is missing: ${module.slug}`);
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `vault-tool/${module.slug} ${field} is missing`);
      assert.notEqual(module[field].trim(), "", `vault-tool/${module.slug} ${field} is empty`);
    }
  }

  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "vault-tool", "index.html"), "utf8");
  for (const layer of ["quick", "product", "technical"]) {
    assert.match(overviewHtml, new RegExp(`data-project-reading-panel="${layer}"`), `vault-tool overview omits ${layer} reading layer`);
  }
});

test("vault-tool project surfaces are derived from one currentSnapshot", async () => {
  const source = await readFile(snapshotSourcePath, "utf8");
  assert.match(source, /import\s*\{\s*createProjectSnapshot\s*\}\s*from\s*["']\.\/project-snapshot\.js["']/);
  assert.match(source, /createProjectSnapshot\s*\(/);

  const snapshot = vaultToolProject.currentSnapshot;
  assert.ok(snapshot && typeof snapshot === "object", "vault-tool currentSnapshot is missing");
  assert.deepEqual(vaultToolProject.cardMetrics, snapshot.metrics.map(({ label, value }) => ({ label, value })));
  assert.deepEqual(vaultToolProject.heroFacts, snapshot.facts.filter((fact) => fact.hero).map(({ label, value }) => ({ label, value })));
  assert.deepEqual(vaultToolProject.currentState, {
    observedAt: snapshot.observedAt,
    label: snapshot.label,
    facts: snapshot.facts.map(({ value }) => value),
    gaps: snapshot.gaps
  });
  assert.equal(vaultToolProject.snapshotBoundary, `观察于 ${snapshot.observedAt}；${snapshot.boundary}`);
});

test("vault-tool uses explicit compact search projections and natural requests reach the owning route", async () => {
  const projectionKeys = ["entities", "failureRecovery", "intents", "relations"];
  for (const module of vaultToolModules) {
    assert.ok(module.searchProjection && typeof module.searchProjection === "object", `vault-tool/${module.slug} searchProjection is missing`);
    assert.deepEqual(Object.keys(module.searchProjection).sort(), projectionKeys, `vault-tool/${module.slug} searchProjection drifted`);
    for (const key of projectionKeys) {
      const values = module.searchProjection[key];
      assert.ok(Array.isArray(values) && values.length > 0, `vault-tool/${module.slug} searchProjection.${key} is empty`);
      assert.ok(values.every((value) => typeof value === "string" && value.trim()), `vault-tool/${module.slug} searchProjection.${key} contains a non-string value`);
    }
  }

  const searchAsset = await readFile(path.join(projectRoot, "dist", "search-project-vault-tool.js"), "utf8");
  const indexMatch = searchAsset.match(/^window\.__WLY_PROJECT_SEARCH_INDEX__=([\s\S]*);\s*$/);
  assert.ok(indexMatch, "vault-tool compact search asset is invalid");
  const compactEntries = JSON.parse(indexMatch[1]);
  assert.equal(compactEntries.length, expectedModuleSlugs.length);
  assert.deepEqual(compactEntries.map((entry) => entry.href), expectedModuleSlugs.map((slug) => `/projects/vault-tool/${slug}/`));
  assert.ok(compactEntries.every((entry) => entry.projectSlug === "vault-tool" && typeof entry.search === "string" && !entry.search.includes("[object Object]")));

  for (const [query, expectedHrefs] of [
    ["文件加密后怎么取回来", [
      "/projects/vault-tool",
      "/projects/vault-tool/files-encryption",
      "/projects/vault-tool/view-extract",
      "/projects/vault-tool/passwords-formats",
      "/projects/vault-tool/ai-local-interface"
    ]],
    ["加密库损坏怎么办", [
      "/projects/vault-tool",
      "/projects/vault-tool/passwords-formats",
      "/projects/vault-tool/maintenance-recovery",
      "/projects/vault-tool/ai-local-interface"
    ]]
  ]) {
    const results = searchPanel(query);
    assert.ok(results.some((entry) => entry.projectSlug === "vault-tool"), `vault-tool natural search misses project scope: ${query}`);
    assert.ok(results.some((entry) => expectedHrefs.includes(entry.href)), `vault-tool natural search misses related content: ${query}`);
  }
});

test("vault-workflow maps to vault-tool while Key remains a private target, not project 19", () => {
  const relations = skillProjectLinks["vault-workflow"] || [];
  assert.ok(relations.some((item) => item.relation === "owned-by-project" && item.projectSlug === "vault-tool" && item.moduleSlug === "ai-local-interface"), "vault-workflow is not mapped to the vault-tool project");
  assert.ok(relations.some((item) => item.relation === "no-detail-project" && item.systemAssetId === "key"), "vault-workflow lost its Key private-target mapping");
  assert.equal(projects.length, 18);
  assert.equal(projects.at(-1)?.slug, "vault-tool");
  assert.ok(!projects.some((item) => item.slug === "key"), "Key must not become a nineteenth project");
  assert.ok(!routePaths.some((route) => route.startsWith("/projects/key")), "Key must not receive a project route");
});

test("the fictional crypto evidence remains byte-identical and is an explicit JSON download", async () => {
  const relativePath = "media/vault-tool/synthetic-roundtrip.json";
  const [original, built] = await Promise.all([
    readFile(path.join(projectRoot, "public", relativePath)),
    readFile(path.join(projectRoot, "dist", relativePath))
  ]);
  assert.deepEqual(built, original);
  assert.equal(original.length, 4231);
  assert.equal(createHash("sha256").update(original).digest("hex"), "4add06a29a8b12f68a9f41783bb859a4463c546bc014ec3eaf69940800211c36");
  const evidence = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(original));
  assert.equal(evidence.crypto_backend, "windows_cng");
  assert.equal(evidence.kdf_or_aes_stubbed, false);
  assert.equal(evidence.fixture_files.length, 3);
  assert.equal(evidence.normal_encrypt.roundtrip_matches, true);
  assert.equal(evidence.same_name_merge.same_name_new_wins, true);
  assert.equal(evidence.metadata_cli.plan_invalid_with_source_decision, "manual_review");
  const html = await readFile(path.join(projectRoot, "dist/projects/vault-tool/files-encryption/index.html"), "utf8");
  assert.match(html, /href="\/media\/vault-tool\/synthetic-roundtrip\.json"/);
  assert.match(html, /download="synthetic-roundtrip\.json"/);
});

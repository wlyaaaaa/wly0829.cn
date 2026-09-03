import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { localOcrModules, localOcrProject, modules, project } from "../app/content-localocr.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { skillProjectLinks } from "../app/content-capability-links.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "input-routing",
  "document-structure",
  "results-evidence",
  "jobs-cache",
  "runtime-resources",
  "installation-recovery"
];

test("LocalOCR exposes its selected project identity and six ordered modules", () => {
  assert.strictEqual(project, localOcrProject);
  assert.strictEqual(modules, localOcrModules);
  assert.deepEqual(
    {
      slug: localOcrProject.slug,
      order: localOcrProject.order,
      title: localOcrProject.title,
      route: localOcrProject.route,
      visibility: localOcrProject.visibility
    },
    {
      slug: "localocr",
      order: 17,
      title: "LocalOCR",
      route: "/projects/localocr",
      visibility: "公开仓库"
    }
  );
  assert.deepEqual(localOcrModules.map((item) => item.slug), expectedModuleSlugs);
  assert.equal(new Set(localOcrModules.map((item) => item.slug)).size, expectedModuleSlugs.length);
});

test("LocalOCR module routes and snapshot projections stay aligned with the registered package", () => {
  const entry = projectCatalog.find((candidate) => candidate.project.slug === "localocr");
  assert.ok(entry, "LocalOCR is missing from the project catalog");
  assert.strictEqual(entry.project, localOcrProject);
  assert.strictEqual(entry.modules, localOcrModules);
  assert.deepEqual(
    {
      id: entry.registration.id,
      order: entry.registration.order,
      title: entry.registration.title,
      route: entry.registration.route,
      repo: entry.registration.source.repo,
      visibility: entry.registration.source.visibility,
      defaultBranch: entry.registration.source.default_branch,
      localRoot: entry.registration.source.local_root
    },
    {
      id: "localocr",
      order: 17,
      title: "LocalOCR",
      route: "/projects/localocr",
      repo: "wlyaaaaa/LocalOCR",
      visibility: "PUBLIC",
      defaultBranch: "main",
      localRoot: "E:\\Projects\\Tools\\LocalOCR"
    }
  );

  assert.ok(routePaths.includes("/projects/localocr"));
  for (const module of localOcrModules) assert.ok(routePaths.includes(`/projects/localocr/${module.slug}`));

  const snapshot = localOcrProject.currentSnapshot;
  assert.ok(snapshot && typeof snapshot === "object");
  assert.ok(Number.isFinite(Date.parse(snapshot.observedAt)));
  assert.ok(snapshot.metrics.length >= 1 && snapshot.facts.length >= 1 && snapshot.gaps.length >= 1);
  assert.deepEqual(localOcrProject.cardMetrics, snapshot.metrics.map(({ label, value }) => ({ label, value })));
  assert.deepEqual(localOcrProject.heroFacts, snapshot.facts.filter((fact) => fact.hero).map(({ label, value }) => ({ label, value })));
  assert.deepEqual(localOcrProject.currentState, {
    observedAt: snapshot.observedAt,
    label: snapshot.label,
    facts: snapshot.facts.map(({ value }) => value),
    gaps: snapshot.gaps
  });
  assert.equal(localOcrProject.snapshotBoundary, `观察于 ${snapshot.observedAt}；${snapshot.boundary}`);
});

test("LocalOCR ownership and System project links resolve to its project routes", () => {
  const relations = skillProjectLinks.localocr;
  assert.ok(Array.isArray(relations) && relations.length === 1);
  assert.deepEqual(
    {
      relation: relations[0].relation,
      projectSlug: relations[0].projectSlug,
      moduleSlug: relations[0].moduleSlug
    },
    {
      relation: "owned-by-project",
      projectSlug: "localocr",
      moduleSlug: "input-routing"
    }
  );
  assert.equal(typeof relations[0].label, "string");

  const asset = systemProjectDomains.flatMap((domain) => domain.assets).find((candidate) => candidate.id === "local-ocr");
  assert.ok(asset, "System LocalOCR asset is missing");
  assert.equal(asset.href, "/projects/localocr");
});

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function pngDimensions(bytes) {
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], "gallery asset is not a PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test("LocalOCR public sample gallery preserves declared bytes, hashes, and PNG dimensions", async () => {
  assert.ok(Array.isArray(localOcrProject.gallery) && localOcrProject.gallery.length >= 1);
  for (const item of localOcrProject.gallery) {
    const relativePath = item.src.replace(/^\//, "");
    const publicBytes = await readFile(path.join(projectRoot, "public", relativePath));
    const distBytes = await readFile(path.join(projectRoot, "dist", relativePath));
    assert.equal(publicBytes.length, item.originalBytes, `${item.src} public byte count drifted`);
    assert.equal(sha256(publicBytes), item.originalSha256, `${item.src} public SHA-256 drifted`);
    assert.equal(distBytes.length, item.originalBytes, `${item.src} dist byte count drifted`);
    assert.equal(sha256(distBytes), item.originalSha256, `${item.src} dist SHA-256 drifted`);
    assert.deepEqual([...distBytes], [...publicBytes], `${item.src} dist bytes differ from the public source asset`);
    assert.deepEqual(pngDimensions(publicBytes), { width: item.width, height: item.height }, `${item.src} declared PNG dimensions drifted`);
    assert.deepEqual(pngDimensions(distBytes), { width: item.width, height: item.height }, `${item.src} dist PNG dimensions drifted`);
  }

  const rawArtifacts = [
    ["sample-table-actual.md", "08bee52074af89a00b503d2f89e77ec8bc75fb3ff7e190e95c64c0f4341e86d3"],
    ["sample-table-actual.json", "9166e6012c0e30e9e392367e4dfb08ee6a8c9290d8e07cfd3e4cedcb1d695527"]
  ];
  for (const [name, expectedHash] of rawArtifacts) {
    const publicBytes = await readFile(path.join(projectRoot, "public", "media", "localocr", name));
    const distBytes = await readFile(path.join(projectRoot, "dist", "media", "localocr", name));
    assert.equal(sha256(publicBytes), expectedHash, `${name} public SHA-256 drifted`);
    assert.equal(sha256(distBytes), expectedHash, `${name} dist SHA-256 drifted`);
    assert.deepEqual([...distBytes], [...publicBytes], `${name} dist bytes differ from the public source artifact`);
  }
});

test("the original UTF-8 Markdown is an explicit download instead of a charset-guessed page", async () => {
  const module = localOcrModules.find((item) => item.slug === "results-evidence");
  const source = module.sources.find((item) => item.path === "sample-table-actual.md");
  assert.equal(source.download, "sample-table-actual.md");
  assert.equal(source.href, "/media/localocr/sample-table-actual.md");
  const html = await readFile(path.join(projectRoot, "dist", "projects", "localocr", "results-evidence", "index.html"), "utf8");
  assert.match(html, /href="\/media\/localocr\/sample-table-actual\.md"[^>]*download="sample-table-actual\.md"[^>]*>下载 /);
  const bytes = await readFile(path.join(projectRoot, "public", "media", "localocr", "sample-table-actual.md"));
  assert.ok(new TextDecoder("utf-8", { fatal: true }).decode(bytes).includes("商品名称"));
});

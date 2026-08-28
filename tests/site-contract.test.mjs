import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ideas, modules, routeMeta, routePaths, skills } from "../app/site-content.js";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");

test("the .agents project has exactly the six product-defined modules", () => {
  assert.deepEqual(
    modules.map((item) => item.slug),
    [
      "rules-contracts",
      "capability-routing",
      "authorization-owner",
      "protected-policy",
      "skills-plugins",
      "context-evidence"
    ]
  );
  for (const module of modules) {
    assert.ok(module.problem.length > 80, `${module.slug} needs a useful problem statement`);
    assert.ok(module.actions.length >= 4, `${module.slug} needs concrete actions`);
    assert.ok(module.boundaries.length >= 3, `${module.slug} needs explicit boundaries`);
    assert.ok(module.sources.length >= 3, `${module.slug} needs source entries`);
    assert.ok(module.tests.length >= 3, `${module.slug} needs verification entries`);
  }
});

test("all seven public ideas have complete, human-readable detail pages", () => {
  assert.equal(ideas.length, 7);
  for (const idea of ideas) {
    assert.ok(idea.definition.length > 50);
    assert.ok(idea.problem.length > 50);
    assert.ok(idea.use.length >= 3);
    assert.ok(idea.basis.length > 50);
    assert.ok(idea.boundary.length > 30);
  }
});

test("the Skills directory matches the current installed supply names", () => {
  assert.deepEqual(
    skills.map((item) => item.slug),
    [
      "authorization-file-broker",
      "chinese-asr",
      "media-person-self",
      "native-economy-routing",
      "codex-local-remote-control",
      "file-intake-router",
      "google-workspace-direct",
      "local-secret-broker",
      "localocr",
      "llm-backend-toolkit",
      "personal-health",
      "personal-litigation",
      "personal-materials",
      "project-entry-gate",
      "wechat-direct",
      "vault-workflow",
      "md-to-pdf",
      "pdf-render-safe",
      "control-plane-doctor",
      "mojibake-doctor",
      "tailscale-safe-exposure",
      "token-budget-advisor"
    ]
  );
  for (const skill of skills) {
    for (const key of ["summary", "purpose", "trigger", "why", "boundary"]) {
      assert.ok(skill[key].length > 20, `${skill.slug}.${key} is incomplete`);
    }
  }
});

test("every public route is unique and has useful SEO metadata", () => {
  assert.equal(new Set(routePaths).size, routePaths.length);
  for (const route of routePaths) {
    const meta = routeMeta(route);
    assert.match(meta.title, /吴乐阳/);
    assert.ok(meta.description.length >= 20, `${route} description is too short`);
    assert.ok(meta.description.length <= 220, `${route} description is too long`);
  }
});

test("production build contains direct GitHub Pages entry files for every route", async () => {
  const distRoot = path.join(projectRoot, "dist");
  await access(path.join(distRoot, "index.html"));
  for (const route of routePaths) {
    const routeIndex = route === "/"
      ? path.join(distRoot, "index.html")
      : path.join(distRoot, ...route.slice(1).split("/"), "index.html");
    const html = await readFile(routeIndex, "utf8");
    assert.match(html, /<div id="root"><\/div>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/wly0829\.cn\//);
    assert.doesNotMatch(html, /\.\.\/assets\//);
  }
});

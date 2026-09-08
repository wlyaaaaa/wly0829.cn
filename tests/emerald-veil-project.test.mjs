import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { emeraldVeilModules, emeraldVeilProject } from "../app/content-emerald-veil.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoute = "/projects/emerald-veil";

test("Emerald Veil registration preserves rank, source and complete module routes", async () => {
  const registry = JSON.parse(await readFile(path.join(root, "config/panel-projects.json"), "utf8"));
  const plan = JSON.parse(await readFile(path.join(root, "config/final-project-order.json"), "utf8"));
  const entry = registry.projects.find((item) => item.id === "emerald-veil");
  assert.ok(entry?.enabled);
  assert.equal(entry.order, 29);
  assert.equal(entry.source.repo, "wlyaaaaa/emerald-veil");
  assert.equal(entry.source.default_branch, "main");
  assert.equal(entry.source.visibility, "PUBLIC");
  assert.equal(entry.ai_refresh.content_path, "app/content-emerald-veil.js");
  const planned = plan.projects.find((item) => item.id === entry.id);
  assert.equal(planned.final_rank, 29);
  assert.equal(planned.state, "published");
  const catalog = projectCatalog.find((item) => item.project.slug === entry.id);
  assert.ok(catalog);
  assert.ok(routePaths.includes(projectRoute));
  assert.equal(new Set(emeraldVeilModules.map((item) => item.slug)).size, emeraldVeilModules.length);
  for (const module of emeraldVeilModules) {
    assert.ok(routePaths.includes(`${projectRoute}/${module.slug}`));
    assert.ok(emeraldVeilProject.usageExamples.some((item) => item.moduleSlug === module.slug));
  }
});

test("Emerald Veil renders its real reader-state and glossary fields without missing prose", async () => {
  for (const item of [emeraldVeilProject, ...emeraldVeilModules]) {
    for (const state of ["pass", "problem", "unavailable"]) {
      assert.equal(typeof item.readerStates[state], "string");
      assert.ok(item.readerStates[state].trim());
    }
    const route = item === emeraldVeilProject ? projectRoute : `${projectRoute}/${item.slug}`;
    const html = await readFile(path.join(root, "dist", route.slice(1), "index.html"), "utf8");
    assert.doesNotMatch(html, />\s*undefined\s*</);
    for (const state of ["pass", "problem", "unavailable"]) {
      assert.ok(html.includes(item.readerStates[state].slice(0, 10)), `${route}: missing rendered ${state}`);
    }
  }
  assert.ok(emeraldVeilProject.repositoryNote.trim());
  const overview = await readFile(path.join(root, "dist/projects/emerald-veil/index.html"), "utf8");
  assert.doesNotMatch(overview, /Job（任务记录）\s*Object/, "Windows Job Object must remain one technical term");
  for (const term of emeraldVeilProject.glossary) {
    assert.ok(term.meaning?.trim(), `missing visible glossary meaning: ${term.term}`);
    assert.ok(overview.includes(term.meaning.slice(0, 12)), `missing rendered glossary: ${term.term}`);
  }
});

test("Emerald Veil keeps static-background recovery separate from Bubbles install and restore", () => {
  const commands = emeraldVeilProject.operationalEntrypoints;
  assert.ok(commands.every((entry) => !entry.command.includes("\n")), "each visible operational entry is one complete command");
  const publish = commands.find((entry) => entry.command.startsWith("dotnet publish"));
  assert.ok(publish.command.endsWith("-o .\\artifacts\\publish\\win-x64"));
  assert.ok(commands.some((entry) => entry.command.includes("Install-EmeraldVeil.ps1 -Action Install")));
  assert.ok(commands.some((entry) => entry.command.includes("Set-NativeBubbles.ps1 -Action Enable")));
  assert.ok(commands.some((entry) => entry.command.includes("Set-NativeBubbles.ps1 -Action Restore")));
  assert.ok(!commands.some((entry) => entry.command.includes("Set-WindowsBackground.ps1 -Action Restore")));
  const preimage = emeraldVeilProject.technicalContracts.find((entry) => entry.artifact.endsWith("native-bubbles-preimage.json"));
  assert.ok(preimage.schema.startsWith("emerald-veil.native-bubbles-preimage.v2"));
  assert.ok(emeraldVeilModules[0].boundaries.some((text) => text.includes("Windows设置")));
});

test("Emerald Veil serves byte-identical 4K assets with separate lightweight previews", async () => {
  assert.equal(emeraldVeilProject.gallery.length, 2);
  assert.notEqual(emeraldVeilProject.gallery[0].src, emeraldVeilProject.gallery[1].src);
  for (const item of emeraldVeilProject.gallery) {
    const original = await readFile(path.join(root, "public", item.src.slice(1)));
    const thumbnail = await readFile(path.join(root, "public", item.thumbnail.slice(1)));
    assert.equal(original.length, item.originalBytes);
    assert.equal(createHash("sha256").update(original).digest("hex"), item.originalSha256.toLowerCase());
    assert.equal(item.width, 3840);
    assert.equal(item.height, 2160);
    assert.ok(thumbnail.length < original.length / 10);
    assert.equal(thumbnail.subarray(8, 12).toString("ascii"), "WEBP");
    const built = await readFile(path.join(root, "dist", item.src.slice(1)));
    assert.deepEqual(built, original);
  }
});

test("ordinary wallpaper and Bubbles questions reach Emerald Veil", () => {
  for (const query of ["换电脑后恢复青雨壁纸和锁屏", "电脑空闲六分钟显示原生泡泡", "Wallpaper Engine和泡泡一起用", "暂停EmeraldVeil并还原屏保设置"]) {
    const results = searchPanel(query);
    assert.ok(results.slice(0, 5).some((item) => item.href.startsWith(projectRoute)), query);
  }
});

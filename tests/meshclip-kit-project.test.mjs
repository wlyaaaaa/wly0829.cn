// tests/meshclip-kit-project.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { meshclipKitModules, meshclipKitProject } from "../app/content-meshclip-kit.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = meshclipKitModules.map((item) => item.slug);

test("meshclip-kit is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const finalOrder = JSON.parse(await readFile(path.join(projectRoot, "config", "final-project-order.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "meshclip-kit");
  assert.ok(registration, "meshclip-kit missing from panel-projects.json");
  assert.deepEqual(
    {
      id: registration.id,
      order: registration.order,
      title: registration.title,
      enabled: registration.enabled,
      presentationMode: registration.presentation_mode,
      route: registration.route,
      contentPath: registration.ai_refresh.content_path,
      repo: registration.source.repo,
      visibility: registration.source.visibility,
      defaultBranch: registration.source.default_branch,
      localRoot: registration.source.local_root
    },
    {
      id: "meshclip-kit",
      order: 21,
      title: "MeshClip Kit",
      enabled: true,
      presentationMode: "real_dashboard",
      route: "/projects/meshclip-kit",
      contentPath: "app/content-meshclip-kit.js",
      repo: "wlyaaaaa/meshclip-kit",
      visibility: "PUBLIC",
      defaultBranch: "main",
      localRoot: "V:\\Personal\\Projects\\meshclip-kit"
    }
  );
  const planEntry = finalOrder.projects.find((item) => item.id === "meshclip-kit");
  assert.ok(planEntry);
  assert.equal(planEntry.final_rank, 21);
  assert.equal(planEntry.state, "published");
  assert.ok(projectCatalog.some((item) => item.project.slug === "meshclip-kit"));
});

test("meshclip-kit keeps the accepted module routes and three reading layers", async () => {
  assert.equal(moduleSlugs.length, 4);
  assert.deepEqual(moduleSlugs, [
    "tailscale-peer-reachability",
    "exact-peer-firewall-hardening",
    "kde-connect-pairing-sync",
    "silent-watchdog-and-session-lifecycle"
  ]);
  assert.equal(new Set(moduleSlugs).size, moduleSlugs.length, "module slugs must remain unique");
  assert.ok(routePaths.includes(meshclipKitProject.route));
  for (const slug of moduleSlugs) {
    assert.ok(routePaths.includes(`${meshclipKitProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof meshclipKitProject[field], "string");
    assert.notEqual(meshclipKitProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(meshclipKitProject[field]) && meshclipKitProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(meshclipKitProject.usageExamples.map((item) => item.moduleSlug)), new Set(moduleSlugs));
  for (const module of meshclipKitModules) {
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug} missing ${field}`);
      assert.notEqual(module[field].trim(), "");
    }
    for (const listField of ["decisionImpact", "implementation", "flow", "concepts"]) {
      assert.ok(Array.isArray(module[listField]) && module[listField].length > 0, `${module.slug} missing ${listField}`);
    }
    for (const key of ["entities", "failureRecovery", "intents", "relations"]) {
      assert.ok(module.searchProjection[key].length > 0, `${module.slug}.${key} is empty`);
    }
  }
});

test("meshclip-kit preserves manual checks and distinguishes diagnostics from transfer acceptance", () => {
  assert.equal(meshclipKitProject.runtimeFacts.doctorPass, 20);
  assert.equal(meshclipKitProject.runtimeFacts.doctorWarn, 2);
  assert.equal(meshclipKitProject.runtimeFacts.clipboardPasswordSetting, "manual_confirmation_required");
  assert.equal(meshclipKitProject.runtimeFacts.freshCrossDeviceTransfer, "not_executed");
  assert.equal(meshclipKitProject.runtimeFacts.watchdogInitialDelaySeconds, 15);
  assert.equal(meshclipKitProject.runtimeFacts.kdeKnownDevices, 1);
  assert.equal(meshclipKitProject.runtimeFacts.kdeAvailableDevices, 0);
  assert.equal(meshclipKitProject.runtimeFacts.crossDeviceBlocker, "no_paired_and_reachable_kde_device");
  const pairing = meshclipKitModules.find((item) => item.slug === "kde-connect-pairing-sync");
  assert.ok(pairing.verification.some((item) => item.includes("阻止本轮复制与文件验收")));
  assert.ok(meshclipKitProject.currentSnapshot.facts.some((item) => item.value.includes("中继承载加密流量")));
});

test("meshclip-kit explains core safety rules without marketing riddles", () => {
  const text = JSON.stringify({ project: meshclipKitProject, modules: meshclipKitModules });
  for (const expected of [
    "fail-closed",
    "customDevices",
    "Including passwords",
    "watch-kdeconnect",
    "watch-kdeconnect-hidden.vbs",
    "Task Scheduler",
    "doctor.ps1",
    "1714-1764",
    "WhatIf",
    "Android",
    "Pre-login"
  ]) {
    assert.ok(text.includes(expected), `meshclip-kit missing expected reality fact: ${expected}`);
  }
});

test("meshclip-kit first visible labels follow glossing and plain language", () => {
  const text = JSON.stringify({ project: meshclipKitProject, modules: meshclipKitModules });
  assert.match(text, /Tailscale（虚拟组网工具）/);
  assert.match(text, /KDE Connect（跨设备协作工具）/);
  assert.match(text, /Tailnet（Tailscale 虚拟专用网络）/);
  assert.match(text, /fail-closed（失败阻断）/);
  assert.match(text, /VBS（Visual Basic 脚本）/);
  assert.match(text, /Mutex（互斥锁）/);
  assert.match(text, /SHA-256（安全哈希算法 256 位）/);
});

test("meshclip-kit search reaches owning modules and project page", () => {
  const queries = [
    ["跨网络同步两台Windows电脑剪贴板和传文件", "/projects/meshclip-kit"],
    ["Tailscale组网下的KDE Connect防火墙端口收敛", "/projects/meshclip-kit/exact-peer-firewall-hardening"],
    ["KDE Connect看门狗静默守护防止托盘进程退出", "/projects/meshclip-kit/silent-watchdog-and-session-lifecycle"],
    ["怎样避免跨端剪贴板泄露密码和Token", "/projects/meshclip-kit/kde-connect-pairing-sync"],
    ["剪贴板同步断了之后怎样通过doctor诊断排查", "/projects/meshclip-kit"]
  ];

  for (const [query, expectedRoute] of queries) {
    const results = searchPanel(query);
    assert.ok(results.length > 0, `Search returned 0 results for: ${query}`);
    assert.ok(
      results.some((item) => item.href === expectedRoute || item.href.startsWith(meshclipKitProject.route)),
      `Search for "${query}" did not reach ${expectedRoute}. Top result: ${results[0]?.href}`
    );
  }
});

test("System links its Domain 02 asset to the meshclip-kit project page", () => {
  const domain02 = systemProjectDomains.find((domain) => domain.id === "machine-and-remote");
  assert.ok(domain02, "machine-and-remote domain missing");
  const asset = domain02.assets.find((item) => item.id === "meshclip-kit");
  assert.ok(asset, "meshclip-kit asset missing from Domain 02");
  assert.equal(asset.href, "/projects/meshclip-kit");
  assert.equal(asset.repo, "meshclip-kit");
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { sunshineRemoteStreamingModules, sunshineRemoteStreamingProject } from "../app/content-sunshine-remote-streaming.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemDependencyNodes, systemProjectDomains, systemProjectInventory } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "capture-failover",
  "vdd-display-settings",
  "transport-ipv6-direct",
  "bitrate-codec-strategy",
  "remote-power-and-repair"
];

test("sunshine-remote-streaming is the twenty-second and newly registered project", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "sunshine-remote-streaming");
  assert.ok(registration);
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
      id: "sunshine-remote-streaming",
      order: 22,
      title: "Sunshine 远程串流",
      enabled: true,
      presentationMode: "real_dashboard",
      route: "/projects/sunshine-remote-streaming",
      contentPath: "app/content-sunshine-remote-streaming.js",
      repo: "wlyaaaaa/sunshine-remote-streaming",
      visibility: "PRIVATE",
      defaultBranch: "main",
      localRoot: "E:\\Projects\\Tools\\sunshine-remote-streaming"
    }
  );
  assert.equal(registry.projects.length, 22);
  assert.equal(registry.projects.filter((item) => item.order >= 23).length, 0, "must not build items 23-25 in advance");
  assert.equal(projectCatalog.at(-1)?.project.slug, "sunshine-remote-streaming");
  assert.equal(systemProjectInventory.detailedPageCount, 22);
});

test("sunshine-remote-streaming exposes five source-backed modules and three reading layers", async () => {
  assert.deepEqual(sunshineRemoteStreamingModules.map((item) => item.slug), expectedModuleSlugs);
  assert.ok(routePaths.includes(sunshineRemoteStreamingProject.route));
  for (const slug of expectedModuleSlugs) {
    assert.ok(routePaths.includes(`${sunshineRemoteStreamingProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof sunshineRemoteStreamingProject[field], "string");
    assert.notEqual(sunshineRemoteStreamingProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(sunshineRemoteStreamingProject[field]) && sunshineRemoteStreamingProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(sunshineRemoteStreamingProject.usageExamples.map((item) => item.moduleSlug)), new Set(expectedModuleSlugs));
  for (const module of sunshineRemoteStreamingModules) {
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug} missing ${field}`);
      assert.notEqual(module[field].trim(), "");
    }
    for (const key of ["entities", "failureRecovery", "intents", "relations"]) {
      assert.ok(module.searchProjection[key].length > 0, `${module.slug}.${key} is empty`);
    }
  }
  let overviewHtml = "";
  try {
    overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "sunshine-remote-streaming", "index.html"), "utf8");
  } catch {}
  if (overviewHtml) {
    for (const layer of ["quick", "product", "technical"]) {
      assert.match(overviewHtml, new RegExp(`data-project-reading-panel="${layer}"`));
    }
  }
});

test("sunshine-remote-streaming explains physical primary priority, VDD fallback and window guard", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of [
    "物理主屏",
    "MTT1337",
    "VDD",
    "15 秒",
    "5 秒",
    "RTSP",
    "拉回",
    "LIAN LI",
    "水冷屏",
    "HS2",
    "BlockedByGpuStability",
    "Kernel-Power 41",
    "nvlddmkm"
  ]) {
    assert.ok(text.includes(expected), `capture failover truth missing: ${expected}`);
  }
  assert.match(sunshineRemoteStreamingProject.summary, /物理主屏优先.*MTT1337.*VDD.*安全兜底/s);
  assert.match(text, /复制显示器.*(?:坚决不用|不使用|绝不使用)/s);
  assert.match(text, /水冷屏.*机箱屏.*(?:黑名单|禁止|不碰)/s);
  assert.match(text, /BlockedByGpuStability.*(?:因 GPU 不稳定阻断|停止.*拓扑)/s);
});

test("sunshine-remote-streaming explains transport decoupling and end-to-end IPv6 direct connection", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of [
    "Tailscale",
    "三层 NAT",
    "IPv6",
    "P2P",
    "DERP",
    "不出海",
    "repair-stream.ps1",
    "verify-path.ps1",
    "unattended"
  ]) {
    assert.ok(text.includes(expected), `transport truth missing: ${expected}`);
  }
  assert.match(text, /串流层.*传输层.*解耦/s);
  assert.match(text, /端到端.*IPv6.*直连.*绕开.*DERP/s);
  assert.match(text, /固定代理端口.*(?:清除|移除|清理)/s);
});

test("sunshine-remote-streaming enforces CBR 18-20 Mbps and AV1 codec under restricted 32 Mbps uplink", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of [
    "32 Mbps",
    "CBR",
    "18–20 Mbps",
    "AV1",
    "RTX 5090 D",
    "骁龙 8 Elite",
    "小米 15 Pro",
    "FEC",
    "CQP"
  ]) {
    assert.ok(text.includes(expected), `bitrate and codec truth missing: ${expected}`);
  }
  assert.match(text, /32 Mbps.*硬红线|32 Mbps.*上行/s);
  assert.match(text, /坚决不(?:用|使用) CQP|严禁.*CQP.*爆上行/s);
  assert.match(text, /AV1.*硬编.*硬解/s);
});

test("sunshine-remote-streaming clarifies remote power-on trade-offs between WoL and smart plug", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of [
    "智能插座",
    "Restore on AC Power Loss",
    "来电自启",
    "Realtek 2.5GbE",
    "WoL",
    "Wi-Fi",
    "WoWLAN",
    "极不可靠"
  ]) {
    assert.ok(text.includes(expected), `remote wake-up truth missing: ${expected}`);
  }
  assert.match(text, /纯无线.*WoWLAN.*极不可靠/s);
  assert.match(text, /智能插座.*BIOS 来电自启/s);
});

test("sunshine-remote-streaming first visible labels follow glossing and professional plain language", () => {
  assert.equal(sunshineRemoteStreamingProject.currentSnapshot.observedAt, "2026-09-04");
  assert.match(sunshineRemoteStreamingProject.kicker, /2026-09-04/);
  assert.doesNotMatch(sunshineRemoteStreamingProject.kicker, /\bfailover\b|\bprofile\b|\bcodec\b/i);
  const failover = sunshineRemoteStreamingModules.find((item) => item.slug === "capture-failover");
  const display = sunshineRemoteStreamingModules.find((item) => item.slug === "vdd-display-settings");
  const transport = sunshineRemoteStreamingModules.find((item) => item.slug === "transport-ipv6-direct");
  const bitrate = sunshineRemoteStreamingModules.find((item) => item.slug === "bitrate-codec-strategy");
  const power = sunshineRemoteStreamingModules.find((item) => item.slug === "remote-power-and-repair");

  assert.doesNotMatch(failover.shortTitle, /failover/i);
  assert.doesNotMatch(bitrate.shortTitle, /bitrate/i);
  assert.doesNotMatch(power.shortTitle, /repair/i);

  assert.match(JSON.stringify(failover), /failover（故障转移）/);
  assert.match(JSON.stringify(failover), /CAS（比较并交换）/);
  assert.match(JSON.stringify(display), /CDS_TEST（显示设置预检）/);
  assert.match(JSON.stringify(transport), /P2P（点对点）/);
  assert.match(JSON.stringify(transport), /DERP（中继服务器）/);
  assert.match(JSON.stringify(bitrate), /CBR（恒定码率）/);
  assert.match(JSON.stringify(bitrate), /CQP（动态量化参数|动态画质量化|恒定量化参数）/);
  assert.match(JSON.stringify(power), /Restore on AC Power Loss（来电自动开机）/);
});

test("sunshine-remote-streaming search reaches the owning modules", () => {
  const cases = [
    ["避免远程串流把窗口丢进壁纸虚拟屏", "/projects/sunshine-remote-streaming/capture-failover"],
    ["独立调整虚拟显示器分辨率而不影响物理主屏", "/projects/sunshine-remote-streaming/vdd-display-settings"],
    ["解决移动三层NAT蜂窝网络连不上串流", "/projects/sunshine-remote-streaming/transport-ipv6-direct"],
    ["配置受限32Mbps上行下的最佳画质与码率", "/projects/sunshine-remote-streaming/bitrate-codec-strategy"],
    ["选择远程开机方案（智能插座与WoL）", "/projects/sunshine-remote-streaming/remote-power-and-repair"]
  ];
  for (const [query, href] of cases) {
    assert.ok(searchPanel(query).slice(0, 5).some((entry) => entry.href === href), `search misses ${query}`);
  }
});

test("System links its remote-workstation asset to the sunshine-remote-streaming project page", () => {
  const asset = systemProjectDomains.flatMap((domain) => domain.assets).find((item) => item.id === "sunshine-remote-streaming");
  const node = systemDependencyNodes.find((item) => item.id === "remote-workstation");
  assert.ok(asset);
  assert.ok(node);
  assert.equal(asset.href, "/projects/sunshine-remote-streaming");
  assert.equal(node.href, "/projects/sunshine-remote-streaming");
});

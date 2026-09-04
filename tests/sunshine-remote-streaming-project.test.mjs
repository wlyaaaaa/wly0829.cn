import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { sunshineRemoteStreamingModules, sunshineRemoteStreamingProject } from "../app/content-sunshine-remote-streaming.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemDependencyNodes, systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = sunshineRemoteStreamingModules.map((item) => item.slug);

test("sunshine-remote-streaming is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "sunshine-remote-streaming");
  assert.ok(registration);
  assert.deepEqual(
    {
      id: registration.id,
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
  assert.ok(projectCatalog.some((item) => item.project.slug === "sunshine-remote-streaming"));
});

test("sunshine-remote-streaming exposes source-backed modules and three reading layers", async () => {
  assert.ok(moduleSlugs.length > 0);
  assert.equal(new Set(moduleSlugs).size, moduleSlugs.length, "module slugs must remain unique");
  assert.ok(routePaths.includes(sunshineRemoteStreamingProject.route));
  for (const slug of moduleSlugs) {
    assert.ok(routePaths.includes(`${sunshineRemoteStreamingProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof sunshineRemoteStreamingProject[field], "string");
    assert.notEqual(sunshineRemoteStreamingProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(sunshineRemoteStreamingProject[field]) && sunshineRemoteStreamingProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(sunshineRemoteStreamingProject.usageExamples.map((item) => item.moduleSlug)), new Set(moduleSlugs));
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
  assert.match(sunshineRemoteStreamingProject.summary, /优先捕获物理主屏.*MTT1337 VDD.*兜底/s);
  assert.match(text, /复制显示器.*(?:坚决不用|不使用|绝不使用)/s);
  assert.match(text, /水冷屏.*机箱屏.*(?:黑名单|禁止|不碰)/s);
  assert.match(text, /BlockedByGpuStability.*(?:因 GPU 不稳定阻断|停止.*拓扑)/s);
});

test("sunshine-remote-streaming separates transport capability from current peer evidence", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of [
    "Tailscale",
    "三层 NAT",
    "IPv6",
    "P2P",
    "DERP",
    "peer",
    "Unknown",
    "repair-stream.ps1",
    "verify-path.ps1",
    "unattended"
  ]) {
    assert.ok(text.includes(expected), `transport truth missing: ${expected}`);
  }
  assert.match(text, /串流层.*传输层.*解耦/s);
  assert.match(text, /只有.*peer.*direct.*才.*直连/s);
  assert.match(text, /没有.*peer.*不能.*不出海|peer.*未测/s);
  assert.match(text, /固定代理端口.*(?:清除|移除|清理)/s);
  assert.doesNotMatch(text, /任何地方.*秒连|延迟稳定在 15[–-]30|串流数据路径直连不出海/);
});

test("sunshine-remote-streaming presents CBR and AV1 as a measured client starting point", () => {
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
  assert.match(text, /约 32 Mbps.*上行|32 Mbps.*配置依据/s);
  assert.match(text, /CBR.*(?:建议|起点|优先).*CQP|CQP.*(?:建议|起点|优先).*CBR/s);
  assert.match(text, /AV1.*硬编.*硬解/s);
  assert.match(text, /不是主机强制|未.*真实会话|本轮没有真实会话/);
  assert.doesNotMatch(text, /丢包率趋近于零|无丢包与卡顿|帧率稳定 60 FPS/);
});

test("sunshine-remote-streaming keeps remote power guidance separate from physical acceptance", () => {
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
  assert.match(text, /(?:文档方案|本轮未验证|冷开机未验|断电.*未验)/s);
  assert.doesNotMatch(text, /绝对可靠的远程.*开机|BIOS 来电自启与网卡驱动层 WoL 均已就绪/);
});

test("sunshine-remote-streaming exposes current blockers instead of promoting green supporting evidence", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  assert.equal(sunshineRemoteStreamingProject.statusTone, "mixed");
  assert.equal(sunshineRemoteStreamingProject.cardStatusTone, "mixed");
  assert.ok(sunshineRemoteStreamingModules.every((item) => item.statusTone === "mixed"));
  assert.match(text, /output_name.*不匹配.*活动输出/s);
  assert.match(text, /22 条匹配.*WER.*GPU.*(?:拒绝|阻止)写入/s);
  assert.match(text, /tailscale-ping.*(?:skipped|跳过)/s);
  assert.match(text, /手机.*(?:未实测|没有执行|未测)/s);
  assert.match(text, /(?:拔线|物理故障转移).*(?:未验|没有)/s);
  assert.match(text, /(?:冷开机|断电).*(?:未验|没有|文档方案)/s);
  assert.doesNotMatch(text, /随时随地可用的毫秒级|任何地方.*秒连|绝对可靠的远程硬核开机/);
});

test("sunshine-remote-streaming explains manual headless recovery and native VDD adapters without invented schemas", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of [
    "Set-SunshineHeadlessConfig.ps1",
    "人工应急",
    "重新运行主屏优先守护",
    "Get-SetVddDisplayMode.ps1",
    "Get-SetVddScaleHdr.ps1",
    "无独立 schema",
    "sunshine.capture-failover-state.v1",
    "Unknown/Physical/Vdd"
  ]) {
    assert.ok(text.includes(expected), `technical truth missing: ${expected}`);
  }
  assert.doesNotMatch(text, /vdd-display-profile\.v1|sunshine\.headless-config\.v1/);
  assert.match(text, /不自动重启、回读或回滚|不自动重启 Sunshine/);
});

test("sunshine-remote-streaming includes the upstream client input boundary without claiming E2E", () => {
  const text = JSON.stringify({ project: sunshineRemoteStreamingProject, modules: sunshineRemoteStreamingModules });
  for (const expected of ["视频与音频", "触控", "键鼠", "手柄", "ViGEmBus", "输入 E2E"]) {
    assert.ok(text.includes(expected), `client input boundary missing: ${expected}`);
  }
  assert.match(text, /本轮.*(?:未做|没有验证).*输入 E2E|手机输入 E2E.*未跑/s);
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

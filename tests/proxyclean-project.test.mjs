import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { proxycleanModules, proxycleanProject } from "../app/content-proxyclean.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = proxycleanModules.map((item) => item.slug);

test("proxyclean is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const finalOrder = JSON.parse(await readFile(path.join(projectRoot, "config", "final-project-order.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "proxyclean");
  assert.ok(registration, "proxyclean missing from panel-projects.json");
  const planEntry = finalOrder.projects.find((item) => item.id === "proxyclean");
  assert.ok(planEntry);
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
      id: "proxyclean",
      order: planEntry.final_rank,
      title: "ProxyClean",
      enabled: true,
      presentationMode: "real_dashboard",
      route: "/projects/proxyclean",
      contentPath: "app/content-proxyclean.js",
      repo: "wlyaaaaa/ProxyClean",
      visibility: "PUBLIC",
      defaultBranch: "master",
      localRoot: "E:\\Projects\\Tools\\ProxyClean"
    }
  );
  assert.equal(proxycleanProject.order, planEntry.final_rank);
  assert.equal(planEntry.state, "published");
  assert.ok(projectCatalog.some((item) => item.project.slug === "proxyclean"));
});

test("proxyclean keeps the accepted module routes and three reading layers", async () => {
  assert.equal(moduleSlugs.length, 6);
  assert.deepEqual(moduleSlugs, [
    "dead-port-and-route-cleanup",
    "dynamic-proxy-status",
    "targeted-port-shutdown",
    "wifi-rebind-and-recovery",
    "ipv6-routing-control",
    "one-click-and-troubleshooting-boundaries"
  ]);
  assert.equal(new Set(moduleSlugs).size, moduleSlugs.length, "module slugs must remain unique");
  assert.ok(routePaths.includes(proxycleanProject.route));
  for (const slug of moduleSlugs) {
    assert.ok(routePaths.includes(`${proxycleanProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof proxycleanProject[field], "string");
    assert.notEqual(proxycleanProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(proxycleanProject[field]) && proxycleanProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(proxycleanProject.usageExamples.map((item) => item.moduleSlug)), new Set(moduleSlugs));
  for (const module of proxycleanModules) {
    assert.equal(typeof module.shortTitle, "string", `${module.slug} missing shortTitle`);
    assert.notEqual(module.shortTitle.trim(), "", `${module.slug} has an empty shortTitle`);
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

test("proxyclean snapshot records its current published source identity", () => {
  assert.match(proxycleanProject.sourceCommit, /^[a-f0-9]{40}$/);
  assert.ok(proxycleanProject.evolution.some((stage) => stage.date === "2026-09-18" && stage.commit?.startsWith("be5d3f5")), "the physical route guard repair remains attached to its product stage");
});

test("proxyclean explains core safety rules without marketing riddles", () => {
  const text = JSON.stringify({ project: proxycleanProject, modules: proxycleanModules });
  for (const expected of [
    "备用默认路由",
    "审计",
    "零固定端口表",
    "清成直连",
    "198.18",
    "SendMessageTimeout",
    "InternetSetOption",
    "settings-store.json",
    "SoftReset",
    "AdapterReset",
    "2737328",
    "IPv6-Status.ps1",
    "HardwareInterface=true",
    "控制面",
    "数据面",
    "ExtraProcessName",
    "-Direct",
    "活或远程",
    "DPAPI",
    "原值",
    "System Proxy 默认关闭",
    "DNS 覆写默认关闭",
    "多路径"
  ]) {
    assert.ok(text.includes(expected), `ProxyClean missing expected reality fact: ${expected}`);
  }
  const deadPort = proxycleanModules.find((item) => item.slug === "dead-port-and-route-cleanup");
  assert.match(JSON.stringify(deadPort), /Test-LocalProxyDead.*全部端点为本地回环且无活跃监听/);
  assert.match(JSON.stringify(deadPort.boundaries), /NO_PROXY.*绝对不碰|不.*NO_PROXY/);
  assert.match(JSON.stringify(deadPort.implementation), /原值和步骤.*preimage.*写后回读.*逆序恢复/s);
  for (const forbidden of ["强杀进程树", "Restart-NetAdapter", "所有前台窗口与终端会话立即感知", "两秒内恢复正常上网", "Docker 与终端无缝复活", "切换入口停止或失败，保留原绑定"]) {
    assert.equal(text.includes(forbidden), false, `ProxyClean retains an overclaim: ${forbidden}`);
  }
});

test("proxyclean preserves public technical names without imposing one global gloss", () => {
  const text = JSON.stringify({ project: proxycleanProject, modules: proxycleanModules });
  for (const term of ["TUN", "fake-ip", "WinINET", "PInvoke", "DNS", "DHCP", "Docker Desktop", "PID", "IPv6", "UAC", "WebRTC"]) assert.ok(text.includes(term), `ProxyClean technical identity is missing: ${term}`);
  assert.match(text, /窗口|图形界面|GUI/);
});

test("proxyclean search reaches owning modules and project page", () => {
  const queries = [
    ["代理断开后网页打不开", "/projects/proxyclean"],
    ["清理死端口", "/projects/proxyclean/dead-port-and-route-cleanup"],
    ["TUN模式残留的198.18黑洞默认路由", "/projects/proxyclean/dead-port-and-route-cleanup"],
    ["Docker拉取镜像一直超时是不是本地代理被卡死", "/projects/proxyclean/dynamic-proxy-status"],
    ["强杀占用7890端口的代理客户端", "/projects/proxyclean/targeted-port-shutdown"],
    ["WiFi连上但是打不开网页怎么刷新网络", "/projects/proxyclean/wifi-rebind-and-recovery"],
    ["只切换物理网卡IPv6但保留Tailscale和WSL", "/projects/proxyclean/ipv6-routing-control"],
    ["代理订阅更新失败但现有节点还能上网怎么区分", "/projects/proxyclean/one-click-and-troubleshooting-boundaries"]
  ];

  for (const [query, expectedRoute] of queries) {
    const results = searchPanel(query);
    assert.ok(results.length > 0, `Search returned 0 results for: ${query}`);
    assert.ok(
      results.some((item) => item.href === expectedRoute || item.href.startsWith(proxycleanProject.route)),
      `Search for "${query}" did not reach ${expectedRoute}. Top result: ${results[0]?.href}`
    );
  }
});

test("ProxyClean stays reachable from its own project route without restoring a System asset catalog", () => {
  assert.ok(routePaths.includes(proxycleanProject.route));
});

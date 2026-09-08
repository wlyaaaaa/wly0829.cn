import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { proxycleanModules, proxycleanProject } from "../app/content-proxyclean.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemProjectDomains } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleSlugs = proxycleanModules.map((item) => item.slug);

test("proxyclean is registered as a published project in the final plan", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const finalOrder = JSON.parse(await readFile(path.join(projectRoot, "config", "final-project-order.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "proxyclean");
  assert.ok(registration, "proxyclean missing from panel-projects.json");
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
      order: 19,
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
  const planEntry = finalOrder.projects.find((item) => item.id === "proxyclean");
  assert.ok(planEntry);
  assert.equal(planEntry.final_rank, 19);
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

test("proxyclean snapshot binds to the published physical route guard repair", () => {
  assert.equal(proxycleanProject.sourceCommit, "857b1104cb30897da8f755ef2dbb25fbe1eeea69");
});

test("proxyclean explains core safety rules without marketing riddles", () => {
  const text = JSON.stringify({ project: proxycleanProject, modules: proxycleanModules });
  for (const expected of [
    "绝不把持久设置焊到一个会消失的端口上",
    "备用默认路由",
    "动态审计",
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
    "STILL listening",
    "-Direct",
    "活/远程",
    "ProxyClean -Quiet",
    "anyOn => 全部 OFF",
    "System Proxy 默认关闭",
    "DNS 覆写默认关闭",
    "多路径"
  ]) {
    assert.ok(text.includes(expected), `ProxyClean missing expected reality fact: ${expected}`);
  }
  for (const forbidden of ["强杀进程树", "Restart-NetAdapter", "所有前台窗口与终端会话立即感知", "两秒内恢复正常上网", "Docker 与终端无缝复活", "切换入口停止或失败，保留原绑定"]) {
    assert.equal(text.includes(forbidden), false, `ProxyClean retains an overclaim: ${forbidden}`);
  }
});

test("proxyclean first visible labels follow glossing and plain language", () => {
  const text = JSON.stringify({ project: proxycleanProject, modules: proxycleanModules });
  assert.match(text, /TUN（虚拟网卡）|TUN（虚拟网络设备）/);
  assert.match(text, /fake-ip（伪造 IP 地址）/);
  assert.match(text, /WinINET（Windows 互联网配置）/);
  assert.match(text, /PInvoke（平台调用）/);
  assert.match(text, /DNS（域名解析系统）/);
  assert.match(text, /DHCP（动态主机配置协议）/);
  assert.match(text, /Docker Desktop（Docker 桌面版）/);
  assert.match(text, /PID（进程标识符）/);
  assert.match(text, /GUI（图形界面）/);
  assert.match(text, /IPv6（第六版互联网协议）/);
  assert.match(text, /UAC（用户账户控制）/);
  assert.match(text, /WebRTC（网页实时通信）/);
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

test("System links its proxy-clean asset to the proxyclean project page", () => {
  const machineDomain = systemProjectDomains.find((item) => item.id === "machine-and-remote");
  assert.ok(machineDomain);
  const asset = machineDomain.assets.find((item) => item.id === "proxy-clean");
  assert.ok(asset);
  assert.equal(asset.href, "/projects/proxyclean");
});

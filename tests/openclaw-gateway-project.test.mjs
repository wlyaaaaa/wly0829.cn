import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { openClawGatewayModules, openClawGatewayProject } from "../app/content-openclaw-gateway.js";
import { projectCatalog, routePaths } from "../app/site-content.js";
import { searchPanel } from "../app/search.js";
import { systemDependencyNodes, systemProjectDomains, systemProjectInventory } from "../app/system-home-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedModuleSlugs = [
  "channel-handoff",
  "model-cost",
  "gateway-runtime",
  "managed-update",
  "backup-restore",
  "bootstrap-install",
  "codeg-bridge"
];

test("OpenClawGateway is the twenty-first and only newly registered project", async () => {
  const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
  const registration = registry.projects.find((item) => item.id === "openclaw-gateway");
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
      id: "openclaw-gateway",
      order: 21,
      title: "OpenClawGateway",
      enabled: true,
      presentationMode: "real_dashboard",
      route: "/projects/openclaw-gateway",
      contentPath: "app/content-openclaw-gateway.js",
      repo: "wlyaaaaa/OpenClawGateway",
      visibility: "PUBLIC",
      defaultBranch: "main",
      localRoot: "E:\\Projects\\Tools\\OpenClawGateway"
    }
  );
  assert.equal(registry.projects.length, 21);
  assert.equal(registry.projects.filter((item) => item.order >= 22).length, 0);
  assert.equal(projectCatalog.at(-1)?.project.slug, "openclaw-gateway");
  assert.equal(systemProjectInventory.detailedPageCount, 21);
});

test("OpenClawGateway exposes seven source-backed modules and three reading layers", async () => {
  assert.deepEqual(openClawGatewayModules.map((item) => item.slug), expectedModuleSlugs);
  assert.ok(routePaths.includes(openClawGatewayProject.route));
  for (const slug of expectedModuleSlugs) {
    assert.ok(routePaths.includes(`${openClawGatewayProject.route}/${slug}`), `missing route: ${slug}`);
  }
  for (const field of ["summary", "why", "plainExample", "result"]) {
    assert.equal(typeof openClawGatewayProject[field], "string");
    assert.notEqual(openClawGatewayProject[field].trim(), "");
  }
  for (const field of ["components", "technicalContracts", "evidenceLayers", "productPrinciples", "responsibilities", "exclusions", "glossary", "usageExamples", "operatingFlow", "operationalEntrypoints"]) {
    assert.ok(Array.isArray(openClawGatewayProject[field]) && openClawGatewayProject[field].length > 0, `missing project field: ${field}`);
  }
  assert.deepEqual(new Set(openClawGatewayProject.usageExamples.map((item) => item.moduleSlug)), new Set(expectedModuleSlugs));
  for (const module of openClawGatewayModules) {
    for (const field of ["value", "why", "example", "result", "problem", "status", "relation"]) {
      assert.equal(typeof module[field], "string", `${module.slug} missing ${field}`);
      assert.notEqual(module[field].trim(), "");
    }
    for (const key of ["entities", "failureRecovery", "intents", "relations"]) {
      assert.ok(module.searchProjection[key].length > 0, `${module.slug}.${key} is empty`);
    }
  }
  const overviewHtml = await readFile(path.join(projectRoot, "dist", "projects", "openclaw-gateway", "index.html"), "utf8");
  for (const layer of ["quick", "product", "technical"]) {
    assert.match(overviewHtml, new RegExp(`data-project-reading-panel="${layer}"`));
  }
});

test("OpenClawGateway tells the real message journey without claiming message E2E", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  for (const expected of ["Telegram", "飞书", "running/starting", "connected=false", "Google Chat", "disabled", "lastInbound/lastOutbound", "0/2", "Funnel", "active（活动）"]) {
    assert.ok(text.includes(expected), `channel truth missing: ${expected}`);
  }
  assert.match(openClawGatewayProject.summary, /Telegram.*飞书.*Gateway.*本地模型.*远程模型.*原渠道/s);
  assert.match(text, /没有(?:发送|完成).*测试消息|没有完成本轮真实入站/s);
  assert.doesNotMatch(text, /Telegram 与飞书(?:的消息)? (?:E2E|端到端)(?:均|都|全部)?(?:已经|已)?(?:通过|完成)/);
});

test("OpenClawGateway separates catalog-backed local placement from cost guarantees", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  for (const expected of ["ollama5090d/qwen3.8:27b", "local=true", "fallback", "utility", "图像模型", "自动远程路线为 0", "21 条远程路线", "Qwen 11", "DeepSeek 2", "Z.AI 8", "远程认证来源有 5 个", "global_zero_cost_enforced=false", "session", "cron", "exit 2"]) {
    assert.ok(text.includes(expected), `cost boundary missing: ${expected}`);
  }
  assert.match(text, /默认本地.*不(?:能|等于).*全局零费用/s);
  assert.doesNotMatch(text, /global_zero_cost_enforced=true|全局零费用(?:已经|已)(?:启用|通过)|(?:已经|已)实现全局零费用/);
});

test("OpenClawGateway keeps runtime, update, backup and recovery evidence separate", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  for (const expected of [
    "aa4f9f1390c68605b5d8135f4077967bf86e0708",
    "2026.8.1",
    "target（目标版）为空",
    "relation=unknown",
    "loopback",
    "18789",
    "LastTaskResult",
    "extended-stable",
    "behind",
    "224,287,339",
    "fresh staging",
    "activation_performed=false",
    "3 组 16",
    "14 个",
    "30/30",
    "34 个 PowerShell",
    "3 条 warning"
  ]) assert.ok(text.includes(expected), `evidence boundary missing: ${expected}`);
  assert.match(text, /当前健康.*历史 LastTaskResult 非零|历史 LastTaskResult 非零.*当前.*健康/s);
  assert.match(text, /恢复.*暂存.*(?:没有|未).*激活/s);
  assert.match(text, /本轮没有更新或重启|真实更新.*未执行/s);
});

test("OpenClawGateway explains four distinct private backup consumers and PUBLIC auto-archive", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  for (const expected of [
    "Codex 小型可读状态",
    "排除 auth",
    "原始 session",
    "SQLite",
    "独立 Codex 备份 Owner",
    "Gemini 小型可读状态",
    "排除原始会话、数据库和媒体",
    "Claude 项目 memory（记忆）目录",
    "OpenClaw config（配置）与 workspace（工作区）",
    "可能包含凭据",
    "本地最近 30 份",
    "G 盘 SHA-256",
    "远端 OID",
    "云端失败",
    "PUBLIC 自动归档",
    "staged",
    "behind",
    "diverged"
  ]) assert.ok(text.includes(expected), `private backup or auto-archive fact missing: ${expected}`);
  assert.match(text, /Codex.*独立.*Owner.*G 盘 SHA-256.*私人 Git.*OID/s);
  assert.match(text, /Gemini.*云端同步失败.*任务失败.*本地.*G 盘.*保留/s);
  assert.match(text, /Claude.*云端失败.*任务失败.*本地.*G 盘.*(?:保留|可用)/s);
  assert.match(text, /OpenClaw.*config.*workspace.*云端失败.*任务失败/s);
  assert.match(text, /无变化.*(?:提交|创建提交).*推送.*远端 OID/s);
  for (const expected of ["3 个备份任务", "4 个消费者", "7 个相关计划任务", "20:05", "22:05", "20:10", "22:10", "20:20", "22:20", "21:15", "先 Claude", "首个非零"]) {
    assert.ok(text.includes(expected), `scheduled backup topology missing: ${expected}`);
  }
  for (const expected of ["每 15 分钟", "周日 13:00", "0x800710E0", "0x00041303", "22:05", "22:10", "22:20", "0x00041306", "01:19:59"]) {
    assert.ok(text.includes(expected), `scheduled task receipt missing: ${expected}`);
  }
  assert.match(text, /Claude.*失败.*(?:仍|继续).*OpenClaw/s);
  assert.match(text, /Claude(?:→|.*再.*)OpenClaw/s);
  assert.match(text, /TLS.*30\/120\/300\/900.*认证.*分叉.*(?:立即|不重试)/s);
  assert.match(text, /AutoPush.*(?:取消|删除|不跨时间).*等待.*01:19:59.*(?:0x00000000|为 0)/s);
  assert.doesNotMatch(text, /AutoPush.*15\/45\/120\/240|保证.{0,12}15 分钟.{0,12}(?:完成|时限|上界)/s);
  assert.doesNotMatch(text, /Codex.*(?:无|不做) G(?: 盘)?热备|G:none|Codex.*best-effort|tools\/backup-codex-memory\.ps1/s);
  assert.doesNotMatch(text, /四条真实计划任务|4 个计划任务/);
});

test("OpenClawGateway is AI-first and does not require the user to operate OpenCode or CodeG", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  assert.match(openClawGatewayProject.summary, /AI Agent（智能体）.*人不需要经常打开 OpenCode、CodeG 或终端/s);
  assert.match(text, /AI 先读再动.*人只守关键边界|AI.*只在.*边界.*授权/s);
  assert.match(text, /CodeG\/Cline.*(?:可选|不是.*前提)/s);
  assert.match(text, /外部发消息.*付费.*更新.*灾备激活.*授权/s);
});

test("OpenClawGateway names all update channels and the exact plugin matrix without publishing review scores", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  for (const expected of ["stable", "extended-stable", "beta", "dev", "Telegram 2026.8.1", "Feishu 2026.6.8", "Google Chat 2026.6.6", "Qwen 2026.8.1", "Z.AI 2026.7.1", "compat issues", "ahead"]) {
    assert.ok(text.includes(expected), `update or plugin fact missing: ${expected}`);
  }
  assert.match(text, /extended-stable.*--channel.*(?:不|不能).*--tag/s);
  assert.match(text, /ahead.*(?:health|健康).*(?:配置|config).*RPC.*模型.*任务.*后验/s);
  assert.doesNotMatch(text, /fresh Sol.*P0\/P1=0|P0\/P1=0.*fresh Sol/);
});

test("OpenClawGateway first visible labels do not defer core English explanations to a glossary", () => {
  assert.equal(openClawGatewayProject.currentSnapshot.observedAt, "2026-09-04");
  assert.match(openClawGatewayProject.kicker, /2026-09-04/);
  assert.doesNotMatch(openClawGatewayProject.kicker, /Windows Gateway|\bRPC\b|\bhealth\b|\bFunnel\b|\bOwner\b/);
  assert.doesNotMatch(openClawGatewayProject.cardStatus, /\bGateway\b|\bRPC\b|\bhealth\b|\bFunnel\b|\bOwner\b/);
  const gateway = openClawGatewayModules.find((item) => item.slug === "gateway-runtime");
  const bootstrap = openClawGatewayModules.find((item) => item.slug === "bootstrap-install");
  const codeg = openClawGatewayModules.find((item) => item.slug === "codeg-bridge");
  assert.doesNotMatch(`${gateway.shortTitle} ${gateway.title}`, /\bGateway\b|\bRPC\b|\bhealth\b/);
  assert.doesNotMatch(bootstrap.shortTitle, /bootstrap/i);
  assert.doesNotMatch(codeg.title, /\bbridge\b|\bmanaged\b/i);
  const channels = openClawGatewayModules.find((item) => item.slug === "channel-handoff");
  const update = openClawGatewayModules.find((item) => item.slug === "managed-update");
  assert.match(JSON.stringify(channels), /loaded（已加载）/);
  assert.match(JSON.stringify(channels), /compat issues（兼容问题）/);
  assert.match(update.result, /current（当前版）\/target（目标版）\/channel（通道）\/relation（版本关系）\/health（健康）/);
  assert.match(JSON.stringify(update), /backup（备份）\/preflight（前检）\/update（更新）\/wait（等待）\/verify（后验验证）/);
  assert.match(codeg.example, /MCP Server（模型上下文协议服务）/);
  assert.match(openClawGatewayProject.readerStates.problem, /behind（落后目标版）.*starting（启动中）.*warning（警告）/s);
  assert.match(JSON.stringify(openClawGatewayProject.dataSources), /models status\/list（模型状态\/目录）.*status\/update（状态\/更新）/s);
  assert.match(JSON.stringify(openClawGatewayProject.responsibilities), /managed bridge（受控桥接）/);
  assert.match(openClawGatewayProject.usageExamples.find((item) => item.moduleSlug === "bootstrap-install").effect, /WhatIf（预演）.*ConfigSource（配置来源）.*schema（数据结构）/);
  const backup = openClawGatewayModules.find((item) => item.slug === "backup-restore");
  assert.match(backup.why, /Owner（负责人）/);
  assert.match(backup.readerStates.unavailable, /staged（已暂存）/);
  assert.match(JSON.stringify(backup.decisionImpact), /TLS（传输层安全）/);
});

test("OpenClawGateway explains bootstrap and CodeG without exposing private payloads", () => {
  const text = JSON.stringify({ project: openClawGatewayProject, modules: openClawGatewayModules });
  for (const expected of ["ConfigSource", "WhatIf", "config validate", "openclaw-bridge", "managed", "initialize", "tools/list", "upsert", "27/27"]) {
    assert.ok(text.includes(expected), `bootstrap or CodeG fact missing: ${expected}`);
  }
  assert.match(text, /端口.*不(?:能|等于).*MCP.*握手|MCP.*未.*(?:initialize|tools\/list)/s);
  assert.doesNotMatch(text, /private-handovers|OPENCLAW_GATEWAY_PASSWORD\s*[:=]|wlyaaaaa\/(?:openclaw-backup|codex-memory|gemini-memory|claude-memory)|tailscale\.[a-z0-9.-]+/i);
});

test("OpenClawGateway search reaches the owning modules", () => {
  const cases = [
    ["从飞书交给OpenClaw但先看是否真的收发", "/projects/openclaw-gateway/channel-handoff"],
    ["默认本地模型还会不会产生远程费用", "/projects/openclaw-gateway/model-cost"],
    ["我不用OpenCode，让AI自动核对OpenClaw备份", "/projects/openclaw-gateway/backup-restore"],
    ["18789端口在但网关到底健康吗", "/projects/openclaw-gateway/gateway-runtime"],
    ["OpenClaw落后稳定版怎么受控更新", "/projects/openclaw-gateway/managed-update"],
    ["官方备份验证后只恢复到暂存目录", "/projects/openclaw-gateway/backup-restore"],
    ["公开模板怎样预演后再写入配置", "/projects/openclaw-gateway/bootstrap-install"],
    ["CodeG里的Cline怎样连接OpenClaw MCP", "/projects/openclaw-gateway/codeg-bridge"]
  ];
  for (const [query, href] of cases) {
    assert.ok(searchPanel(query).slice(0, 5).some((entry) => entry.href === href), `search misses ${query}`);
  }
});

test("System links its existing OpenClawGateway asset and node to the project page", () => {
  const asset = systemProjectDomains.flatMap((domain) => domain.assets).find((item) => item.id === "message-ai-gateway");
  const node = systemDependencyNodes.find((item) => item.id === "message-ai-gateway");
  assert.ok(asset);
  assert.ok(node);
  assert.equal(asset.href, "/projects/openclaw-gateway");
  assert.equal(node.href, "/projects/openclaw-gateway");
  assert.match(`${asset.role} ${node.detail}`, /Telegram.*飞书.*(?:成本|模型).*(?:更新|恢复)/s);
});

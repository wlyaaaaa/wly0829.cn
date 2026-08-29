import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rulesSnapshot as documentedRules } from "../app/content-core.js";
import { skills } from "../app/content-skills.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputPath = path.join(projectRoot, "app", "panel-facts.generated.js");
const powershell = "C:\\Program Files\\PowerShell\\7\\pwsh.exe";
const authorityEntry = "C:\\ProgramData\\PCConfig\\AuthorityHost\\policy\\tools\\Get-ProtectedPolicyAuthorityStatus.ps1";

const sourceRoot = "E:\\.agents";

function run(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: options.cwd,
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024
  });
  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function parseJsonOutput(result, label) {
  const start = result.stdout.indexOf("{");
  const end = result.stdout.lastIndexOf("}");
  if (start < 0 || end < start) {
    throw new Error(`${label} did not return JSON. exit=${result.exitCode} stderr=${result.stderr.trim()}`);
  }
  return { data: JSON.parse(result.stdout.slice(start, end + 1)), exitCode: result.exitCode };
}

function runPowerShellJson(entry, args = [], cwd) {
  return parseJsonOutput(run(powershell, [
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    entry,
    ...args,
    "-Json"
  ], { cwd }), entry);
}

function git(args) {
  const result = run("git", args, { cwd: sourceRoot });
  if (result.exitCode !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function chinaTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}（中国时间）`;
}

function validationRow(layer, status, label, detail) {
  return { layer, status, label, detail };
}

function summarizeTestOutput(output) {
  if (!output) return "测试没有返回错误正文。";
  return String(output)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-3)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 600);
}

function assertNoSecretValue(text, label) {
  const patterns = [
    /sk-[A-Za-z0-9_-]{20,}/,
    /gh[pousr]_[A-Za-z0-9]{20,}/,
    /AIza[0-9A-Za-z_-]{30,}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /(?:password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{8,}/i
  ];
  const hit = patterns.find((pattern) => pattern.test(text));
  if (hit) throw new Error(`${label} contains a credential-like value matched by ${hit}`);
}

git(["fetch", "--no-tags", "origin", "main"]);

const sourceTopLevel = path.resolve(git(["rev-parse", "--show-toplevel"]));
if (sourceTopLevel.toLowerCase() !== path.resolve(sourceRoot).toLowerCase()) {
  throw new Error(`source owner root mismatch: expected=${sourceRoot} actual=${sourceTopLevel}`);
}
const sourceCommit = git(["rev-parse", "HEAD"]);
const trackedMain = git(["rev-parse", "origin/main"]);
const dirty = git(["status", "--porcelain"]);
if (dirty) throw new Error("source owner worktree is dirty; finish or isolate source work before refreshing the public snapshot");
if (sourceCommit !== trackedMain) {
  throw new Error(`source owner is not converged with origin/main: HEAD=${sourceCommit} origin/main=${trackedMain}`);
}

const authorityResult = runPowerShellJson(authorityEntry);
if (authorityResult.exitCode !== 0) {
  throw new Error(`fixed Authority returned exit ${authorityResult.exitCode}; generated snapshot was not changed`);
}
const authority = authorityResult.data;
const allowedAuthorityStatuses = new Set(["active_verified", "candidate_pending", "candidate_unavailable"]);
if (!allowedAuthorityStatuses.has(authority.status) || !authority.required_rules_verified) {
  throw new Error(`fixed Authority is not readable and verified: status=${authority.status}`);
}

const descriptors = new Map((authority.required_rule_descriptors || []).map((item) => [item.logical_id, item]));
const semanticDrift = [];
for (const rule of documentedRules.rules) {
  const descriptor = descriptors.get(rule.logicalId);
  if (!descriptor || descriptor.sha256 !== rule.sha256 || Number(descriptor.bytes) !== Number(rule.bytes)) {
    semanticDrift.push({
      logical_id: rule.logicalId,
      documented_sha256: rule.sha256,
      active_sha256: descriptor?.sha256 || null,
      documented_bytes: rule.bytes,
      active_bytes: descriptor?.bytes || null
    });
  }
}
if (descriptors.size !== documentedRules.rules.length || semanticDrift.length) {
  throw new Error(`material semantic refresh required before changing generation labels: ${JSON.stringify(semanticDrift)}`);
}

const wrapper = runPowerShellJson(path.join(sourceRoot, "tools", "Get-ProtectedMajorActionPolicyStatus.ps1"), [], sourceRoot);
const coverage = runPowerShellJson(path.join(sourceRoot, "tools", "Test-ControlPlaneContractCoverage.ps1"), [], sourceRoot);
const localTests = runPowerShellJson(path.join(sourceRoot, "tests", "Invoke-AllTests.ps1"), ["-Scope", "Local", "-Parallel"], sourceRoot);

const registry = JSON.parse(await readFile(path.join(sourceRoot, "config", "personal-skill-supply.json"), "utf8"));
const registryByName = new Map(registry.skills.map((item) => [item.name, item]));
const activeInstallIntentCount = registry.skills.filter((item) => item.install).length;
const missingSelectedSkills = skills.map((item) => item.slug).filter((name) => !registryByName.get(name)?.install);
if (missingSelectedSkills.length) {
  throw new Error(`selected Skills are not active install intent: ${missingSelectedSkills.join(", ")}`);
}

const postSourceCommit = git(["rev-parse", "HEAD"]);
const postTrackedMain = git(["rev-parse", "origin/main"]);
const postDirty = git(["status", "--porcelain"]);
if (postDirty || postSourceCommit !== sourceCommit || postTrackedMain !== trackedMain || postSourceCommit !== postTrackedMain) {
  throw new Error("source owner changed while the snapshot was being validated; rerun after source convergence");
}
const postAuthorityResult = runPowerShellJson(authorityEntry);
if (postAuthorityResult.exitCode !== 0) throw new Error("fixed Authority changed to a failing state during snapshot validation");
const postAuthority = postAuthorityResult.data;
for (const field of [
  "status",
  "active_generation_id",
  "policy_epoch",
  "active_projection_content_sha256",
  "candidate_pending",
  "candidate_projection_content_sha256",
  "production_activation",
  "integrity_incident"
]) {
  if (JSON.stringify(postAuthority[field]) !== JSON.stringify(authority[field])) {
    throw new Error(`fixed Authority changed during snapshot validation: ${field}`);
  }
}

const testsSummary = localTests?.data?.summary;
const testsPassed = localTests?.exitCode === 0 && localTests?.data?.status === "pass";
const failedTests = (localTests?.data?.results || [])
  .filter((item) => item.status === "fail" || item.status === "timeout")
  .map((item) => ({
    id: item.id,
    path: item.path,
    status: item.status,
    exitCode: item.exit_code,
    durationSeconds: item.duration_seconds,
    reason: summarizeTestOutput(item.output || item.skip_reason)
  }));
const compatibleWrapperStatuses = {
  active_verified: new Set(["active_verified"]),
  candidate_pending: new Set(["candidate_pending", "policy_candidate_pending"]),
  candidate_unavailable: new Set(["candidate_unavailable", "policy_candidate_unavailable"])
};
const wrapperPassed = wrapper.exitCode === 0 && compatibleWrapperStatuses[authority.status]?.has(wrapper.data.status);
const coveragePassed = coverage.exitCode === 0 && coverage.data.status === "pass";

const rows = [
  validationRow(
    "Authority（活动权威）",
    "pass",
    "通过",
    `第 ${authority.policy_epoch} 代活动状态为 ${authority.status}；签名、锚点、ledger、全局入口和生产适配器以固定 Authority 回读为准。`
  ),
  validationRow(
    "Rule closure（五规则闭包）",
    "pass",
    "通过",
    "五份活动文件位于同一 generation 的 projection；页面绑定的 logical id、SHA-256 与字节大小和活动 descriptor 一致。解释层另由内容终审负责，不能由 hash 比对自动证明。"
  ),
  validationRow(
    "Local tests（项目本地总测）",
    testsPassed ? "pass" : "repair",
    testsPassed ? "通过" : "有失败",
    `${testsSummary.total} 项：${testsSummary.pass} 通过、${testsSummary.fail} 失败、${testsSummary.skip} 跳过、${testsSummary.timeout} 超时；未登记 ${testsSummary.unregistered_count} 项。${failedTests.length ? ` 失败项：${failedTests.map((item) => item.id).join("、")}。` : ""}`
  ),
  validationRow(
    "Wrapper（E 侧状态包装器）",
    wrapperPassed ? "pass" : "repair",
    wrapperPassed ? "通过" : "不兼容",
    wrapperPassed
      ? `消费者与固定 Authority 一致，返回 ${wrapper.data.status} / ${wrapper.data.production_state || "production active"}。`
      : `消费者退出码 ${wrapper.exitCode}，状态 ${wrapper.data.status}；固定 Authority 继续单独作为活动权威。`
  ),
  validationRow(
    "Contract coverage（跨控制面合同覆盖）",
    coveragePassed ? "pass" : "repair",
    coveragePassed ? "通过" : "BLOCK",
    coveragePassed
      ? "三个控制面当前合同全部进入 catalog，coverage 验证通过。"
      : `coverage 状态 ${coverage.data.status}，finding ${coverage.data.finding_count ?? "unknown"} 项。`
  )
];

const unresolved = rows.filter((row) => row.status !== "pass").length;
const ruleBinding = await Promise.all(documentedRules.rules.map(async (rule) => {
  const candidateBytes = await readFile(rule.sourcePath);
  const candidateSha256 = createHash("sha256").update(candidateBytes).digest("hex");
  return {
    logicalId: rule.logicalId,
    sha256: rule.sha256,
    bytes: Number(rule.bytes),
    candidateSha256,
    candidateBytes: candidateBytes.length,
    candidateMatchesActive: candidateSha256 === rule.sha256 && candidateBytes.length === Number(rule.bytes)
  };
}));
const generated = {
  schema: "wly.panel-facts.v1",
  generatedBy: "scripts/refresh-panel-snapshot.mjs",
  observedAt: chinaTime(),
  sourceCommit,
  sourceBranch: "main",
  sourceSync: "联网刷新后，HEAD 与 origin/main 一致",
  repositoryVisibility: "私有",
  ruleBinding,
  skills: {
    activeInstallIntent: activeInstallIntentCount,
    selectedPublicCount: skills.length
  },
  authority: {
    status: authority.status,
    statusLabel: authority.status === "active_verified"
      ? "活动规则已验证"
      : authority.status === "candidate_pending"
        ? "活动规则已验证；候选待发布"
        : "活动规则已验证；候选不可取得",
    generation: authority.policy_epoch,
    generationId: authority.active_generation_id,
    policyEpoch: authority.policy_epoch,
    productionActivation: authority.production_activation,
    productionReason: authority.production_activation_reason,
    candidate: authority.candidate_pending ? "存在待发布候选" : authority.candidate_unavailable ? "候选不可取得" : "无待发布候选",
    candidatePending: authority.candidate_pending,
    candidateUnavailable: authority.candidate_unavailable,
    requiredRulesVerified: authority.required_rules_verified,
    integrityIncident: authority.integrity_incident,
    projectionSha256: authority.active_projection_content_sha256,
    anchorSha256: authority.anchor_sha256
  },
  validation: {
    label: unresolved ? `还有 ${unresolved} 层未闭合` : "全部当前验证层已闭合",
    summary: unresolved
      ? `活动规则有效，但仍有 ${unresolved} 个独立验证层没有通过或本次未运行。`
      : "活动 Authority、五规则闭包、本地总测、E 侧消费者和跨控制面合同覆盖均通过。",
    rows,
    failures: failedTests
  }
};

const payloadSha256 = createHash("sha256").update(JSON.stringify(generated), "utf8").digest("hex");
generated.integrity = {
  schema: "wly.panel-facts-integrity.v1",
  algorithm: "sha256",
  payloadSha256
};

const generatedSource = `// Generated by scripts/refresh-panel-snapshot.mjs. Do not hand-edit observed facts.\nexport const generatedPanelFacts = ${JSON.stringify(generated, null, 2)};\n`;
assertNoSecretValue(generatedSource, "generated panel facts");
await writeFile(outputPath, generatedSource, "utf8");

process.stdout.write(`${JSON.stringify({
  status: "generated",
  output: outputPath,
  sourceCommit,
  authorityStatus: authority.status,
  generation: authority.policy_epoch,
  tests: localTests.data.status,
  wrapper: wrapper.data.status,
  coverage: coverage.data.status,
  unresolved
}, null, 2)}\n`);

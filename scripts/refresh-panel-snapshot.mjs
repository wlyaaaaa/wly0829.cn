import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { closeSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { skills } from "../app/content-skills.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputPath = path.join(projectRoot, "app", "panel-facts.generated.js");
const refreshStateDirectory = path.join(projectRoot, ".panel-refresh");
const refreshLockPath = path.join(refreshStateDirectory, "agents-snapshot.lock");
const powershell = "C:\\Program Files\\PowerShell\\7\\pwsh.exe";
const sourceRoot = "E:\\.agents";
const eRulesEntry = path.join(sourceRoot, "tools", "Invoke-EAgentRulesRelease.ps1");
const websiteRegistry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
const documentedRuleBindings = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-rule-bindings.json"), "utf8"));
const sourceRegistration = websiteRegistry.projects.find((item) => item.id === "agents" && item.enabled);
if (!sourceRegistration) throw new Error("enabled agents registration is missing from panel-projects.json");

mkdirSync(refreshStateDirectory, { recursive: true });
let refreshLockDescriptor = null;
let refreshLockReleased = false;

function createRefreshLock() {
  try {
    const descriptor = openSync(refreshLockPath, "wx");
    writeFileSync(descriptor, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }), "utf8");
    return descriptor;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
    let stalePid = null;
    try {
      stalePid = Number(JSON.parse(readFileSync(refreshLockPath, "utf8")).pid);
    } catch {
      // An unreadable lock cannot prove that another refresh is running.
    }
    if (Number.isInteger(stalePid) && stalePid > 0) {
      try {
        process.kill(stalePid, 0);
        throw new Error(`another agents snapshot refresh is already running: pid=${stalePid}`);
      } catch (probeError) {
        if (probeError?.message?.startsWith("another agents snapshot refresh")) throw probeError;
        if (probeError?.code !== "ESRCH") throw new Error(`cannot prove whether agents snapshot refresh pid=${stalePid} is still running`);
      }
    }
    unlinkSync(refreshLockPath);
    const descriptor = openSync(refreshLockPath, "wx");
    writeFileSync(descriptor, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), recoveredStaleLock: true }), "utf8");
    return descriptor;
  }
}

function releaseRefreshLock() {
  if (refreshLockReleased) return;
  refreshLockReleased = true;
  if (refreshLockDescriptor !== null) {
    try { closeSync(refreshLockDescriptor); } catch {}
    refreshLockDescriptor = null;
  }
  try { unlinkSync(refreshLockPath); } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

refreshLockDescriptor = createRefreshLock();
process.once("exit", releaseRefreshLock);

function run(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: options.cwd,
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024
  });
  return { exitCode: result.status ?? 1, stdout: result.stdout || "", stderr: result.stderr || "" };
}

function parseJsonOutput(result, label) {
  const start = result.stdout.indexOf("{");
  const end = result.stdout.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error(`${label} did not return JSON. exit=${result.exitCode} stderr=${result.stderr.trim()}`);
  return { data: JSON.parse(result.stdout.slice(start, end + 1)), exitCode: result.exitCode };
}

function runPowerShellJson(entry, args = [], cwd) {
  return parseJsonOutput(run(powershell, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", entry, ...args, "-Json"], { cwd }), entry);
}

function git(args) {
  const result = run("git", args, { cwd: sourceRoot });
  if (result.exitCode !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function gitSucceeds(args) {
  return run("git", args, { cwd: sourceRoot }).exitCode === 0;
}

function fetchOriginMain() {
  let result = run("git", ["fetch", "--no-tags", "origin", "main"], { cwd: sourceRoot });
  if (result.exitCode !== 0) result = run("git", ["fetch", "--no-tags", "origin", "main"], { cwd: sourceRoot });
  if (result.exitCode !== 0) throw new Error(`cannot refresh source origin/main after one bounded retry: ${result.stderr.trim()}`);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

const privateSourcePathTerms = ["Y29kZXg="].map((value) => Buffer.from(value, "base64").toString("utf8"));

function publicSafeSourcePath(value, index) {
  const normalized = String(value).replaceAll("\\", "/").toLowerCase();
  if (privateSourcePathTerms.some((term) => normalized.includes(term))) {
    return `[workbench-local metadata ${index + 1}]`;
  }
  return value;
}

function releaseIdentity(value) {
  const verified = value?.verified_current || {};
  return JSON.stringify({
    status: value?.status,
    reason: value?.reason,
    pointerSha256: value?.pointer_sha256,
    pointerRevision: value?.pointer?.pointer_revision,
    activatedAtUtc: value?.pointer?.activated_at_utc,
    current: value?.pointer?.current,
    previous: value?.pointer?.previous,
    verifiedCurrent: {
      releaseId: verified.release_id,
      gitCommit: verified.git_commit,
      rulesetSha256: verified.ruleset_sha256,
      releaseRecordSha256: verified.release_record_sha256,
      requiredRulePaths: Object.fromEntries(Object.entries(verified.required_rule_paths || {}).sort(([left], [right]) => left.localeCompare(right))),
      files: [...(verified.files || [])]
        .map((item) => ({ logicalId: item.logical_id, relativePath: item.relative_path, bytes: Number(item.bytes), sha256: item.sha256 }))
        .sort((left, right) => left.logicalId.localeCompare(right.logicalId))
    }
  });
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
  return String(output).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(-3).join(" ").replace(/\s+/g, " ").slice(0, 600);
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

fetchOriginMain();
const sourceTopLevel = path.resolve(git(["rev-parse", "--show-toplevel"]));
if (sourceTopLevel.toLowerCase() !== path.resolve(sourceRoot).toLowerCase()) throw new Error(`source owner root mismatch: expected=${sourceRoot} actual=${sourceTopLevel}`);
const sourceCommit = git(["rev-parse", "HEAD"]);
const trackedMain = git(["rev-parse", "origin/main"]);
const sourceBranch = git(["branch", "--show-current"]);
const [sourceAhead, sourceBehind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/main"]).split(/\s+/).map(Number);
const dirtyResult = run("git", ["status", "--porcelain"], { cwd: sourceRoot });
if (dirtyResult.exitCode !== 0) throw new Error(`git status --porcelain failed: ${dirtyResult.stderr.trim()}`);
const dirty = dirtyResult.stdout.trimEnd();
const sourceDirtyPaths = dirty
  ? dirty.split(/\r?\n/).filter(Boolean).map((line, index) => publicSafeSourcePath(line.slice(3).trim(), index))
  : [];
const initialSourceFingerprint = sha256(Buffer.from(JSON.stringify({
  sourceTopLevel,
  sourceCommit,
  trackedMain,
  sourceBranch,
  sourceAhead,
  sourceBehind,
  dirtyPorcelain: dirtyResult.stdout
}), "utf8"));

const releaseResult = runPowerShellJson(eRulesEntry, ["-Mode", "Inspect"], sourceRoot);
const release = releaseResult.data;
if (releaseResult.exitCode !== 0 || release.status !== "pass" || release.reason !== "e_rules_active_verified") {
  throw new Error(`E rules release is not active and verified: exit=${releaseResult.exitCode} status=${release.status} reason=${release.reason}`);
}
const current = release.verified_current;
if (!current || current.release_id !== release.pointer?.current?.release_id || current.ruleset_sha256 !== release.pointer?.current?.ruleset_sha256) {
  throw new Error("E rules current pointer and verified release are not converged");
}
const initialReleaseIdentity = releaseIdentity(release);
if (!gitSucceeds(["merge-base", "--is-ancestor", current.git_commit, "origin/main"])) throw new Error("active E release commit is no longer reachable from PRIVATE remote main");
const releaseRecordPath = path.join(sourceRoot, "releases", current.release_id, "release.json");
const releaseRecordBytes = await readFile(releaseRecordPath);
if (sha256(releaseRecordBytes) !== current.release_record_sha256) throw new Error("E release record hash does not match current pointer");
const releaseRecord = JSON.parse(releaseRecordBytes.toString("utf8"));
if (releaseRecord.release_id !== current.release_id || releaseRecord.git_commit !== current.git_commit || releaseRecord.ruleset_sha256 !== current.ruleset_sha256) throw new Error("E release record identity does not match verified current");

const descriptors = new Map((current.files || []).map((item) => [item.logical_id, item]));
const documentedLogicalIds = new Set(documentedRuleBindings.rules.map((rule) => rule.logicalId));
const descriptorLogicalIds = new Set(descriptors.keys());
if (
  documentedRuleBindings.schema !== "wly.panel-rule-bindings.v2"
  || documentedRuleBindings.semantic_release_id !== current.release_id
  || documentedRuleBindings.ruleset_sha256 !== current.ruleset_sha256
  || descriptors.size !== documentedRuleBindings.rules.length
  || [...documentedLogicalIds].some((logicalId) => !descriptorLogicalIds.has(logicalId))
) {
  throw new Error(`material semantic refresh required before generating E rules snapshot: semantic=${documentedRuleBindings.semantic_release_id}/${documentedRuleBindings.ruleset_sha256} current=${current.release_id}/${current.ruleset_sha256}`);
}

const coverage = runPowerShellJson(path.join(sourceRoot, "tools", "Test-ControlPlaneContractCoverage.ps1"), [], sourceRoot);
const releaseValidation = run(powershell, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", path.join(sourceRoot, "tests", "Test-EAgentRulesRelease.ps1")], { cwd: sourceRoot });
const skillSupply = runPowerShellJson(path.join(sourceRoot, "tools", "Test-PersonalSkillSupply.ps1"), ["-RequireInstalled", "-NoExternalEvidence"], sourceRoot);
const registry = JSON.parse(await readFile(path.join(sourceRoot, "config", "personal-skill-supply.json"), "utf8"));
const registryByName = new Map(registry.skills.map((item) => [item.name, item]));
const activeInstallIntentCount = registry.skills.filter((item) => item.install).length;
const personalSelectedSkills = skills.filter((item) => item.sourceKind === "personal_install");
const hostIntegratedSkills = skills.filter((item) => item.sourceKind === "host_integrated");
const missingSelectedSkills = personalSelectedSkills
  .map((item) => ({ publicSlug: item.slug, registryName: item.registryName || item.slug }))
  .filter((item) => !registryByName.get(item.registryName)?.install)
  .map((item) => `${item.publicSlug}->${item.registryName}`);
if (missingSelectedSkills.length) throw new Error(`selected Skills are not active install intent: ${missingSelectedSkills.join(", ")}`);
const invalidHostIntegratedEvidenceShape = hostIntegratedSkills.filter((item) => item.availability !== "available" || !item.sourcePath || !/^[a-f0-9]{64}$/.test(item.sourceSha256 || ""));
if (invalidHostIntegratedEvidenceShape.length) throw new Error(`host-integrated Skill snapshot evidence is malformed: ${invalidHostIntegratedEvidenceShape.map((item) => item.slug).join(", ")}`);

const postSourceCommit = git(["rev-parse", "HEAD"]);
const postTrackedMain = git(["rev-parse", "origin/main"]);
const postSourceBranch = git(["branch", "--show-current"]);
const [postSourceAhead, postSourceBehind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/main"]).split(/\s+/).map(Number);
const postDirtyResult = run("git", ["status", "--porcelain"], { cwd: sourceRoot });
if (postDirtyResult.exitCode !== 0) throw new Error(`post-validation git status --porcelain failed: ${postDirtyResult.stderr.trim()}`);
const postSourceFingerprint = sha256(Buffer.from(JSON.stringify({
  sourceTopLevel: path.resolve(git(["rev-parse", "--show-toplevel"])),
  sourceCommit: postSourceCommit,
  trackedMain: postTrackedMain,
  sourceBranch: postSourceBranch,
  sourceAhead: postSourceAhead,
  sourceBehind: postSourceBehind,
  dirtyPorcelain: postDirtyResult.stdout
}), "utf8"));
if (postSourceFingerprint !== initialSourceFingerprint) throw new Error("source owner Git state changed while the snapshot was being validated; no output was replaced, rerun for one stable observation");
const postReleaseResult = runPowerShellJson(eRulesEntry, ["-Mode", "Inspect"], sourceRoot);
if (postReleaseResult.exitCode !== 0 || releaseIdentity(postReleaseResult.data) !== initialReleaseIdentity) {
  throw new Error("E rules current pointer, previous pointer or five-file descriptors changed during snapshot validation; no output was replaced");
}

const releaseValidationPassed = releaseValidation.exitCode === 0;
const failedTests = releaseValidationPassed ? [] : [{
  id: "e-rules-release-validator",
  path: "tests/Test-EAgentRulesRelease.ps1",
  status: "fail",
  exitCode: releaseValidation.exitCode,
  durationSeconds: null,
  reason: summarizeTestOutput(`${releaseValidation.stdout}\n${releaseValidation.stderr}`)
}];
const supplyPassed = skillSupply.exitCode === 0 && skillSupply.data.source?.status === "pass" && skillSupply.data.install?.status === "pass" && skillSupply.data.transaction?.status === "pass";
const coveragePassed = coverage.exitCode === 0 && coverage.data.status === "pass";

const rows = [
  validationRow("E rules current（E 规则当前指针）", "pass", "通过", `${current.release_id} 已从 PRIVATE main commit ${current.git_commit.slice(0, 12)} 激活；pointer revision ${release.pointer.pointer_revision}，previous=${release.pointer.previous?.release_id || "无"}。历史 C 盘材料只作恢复证据。`),
  validationRow("Rule closure（五规则闭包）", "pass", "通过", `五份规则位于同一 ${current.release_id} release，ruleset SHA-256=${current.ruleset_sha256}；页面 logical id、bytes 和 SHA 与 release descriptor 一致。`),
  validationRow("Source checkout（候选源码工作树）", dirty || sourceCommit !== trackedMain || sourceCommit !== current.git_commit ? "repair" : "pass", dirty ? `${sourceDirtyPaths.length} 项未激活施工` : sourceCommit !== trackedMain ? `HEAD/origin 为 ${sourceAhead}/${sourceBehind}` : sourceCommit !== current.git_commit ? `main 已进入下一候选提交` : "与 release 一致", `source HEAD=${sourceCommit.slice(0, 12)}，origin/main=${trackedMain.slice(0, 12)}，active release commit=${current.git_commit.slice(0, 12)}。${dirty ? `未提交路径：${sourceDirtyPaths.join("、")}。` : "工作树干净。"} Source 不等于 active release 时只作候选施工，不会覆盖 ${current.release_id}。`),
  validationRow("E release validator（活动版本验证器）", releaseValidationPassed ? "pass" : "repair", releaseValidationPassed ? "通过" : "失败", releaseValidationPassed ? `Test-EAgentRulesRelease.ps1 已重新验证 ${current.release_id} 的 activator、current/previous、五文件哈希、回退与 C 历史隔离。` : `活动版本验证器退出码 ${releaseValidation.exitCode}：${failedTests[0].reason}`),
  validationRow("Full local tests（当前源码全量回归）", "unknown", "快速刷新未重跑", `网页刷新没有再次运行整个 .agents 本地测试集。它只证明 ${current.release_id} 活动版本、五规则闭包和专用 release validator；当前 source checkout 的全量回归状态保持 Unknown（证据不足）。发布下一代规则前，源码 Owner 仍必须按实际 change surface（改动影响面）完成聚焦或标准验证。`),
  validationRow("Skill supply（能力供应）", supplyPassed ? "pass" : "repair", supplyPassed ? "通过" : "未闭合", supplyPassed ? `${activeInstallIntentCount} 个 personal active install intent；公开目录含 ${personalSelectedSkills.length} 个已选择 personal Skill 与 ${hostIntegratedSkills.length} 个 host-integrated Skill，共 ${skills.length} 个；另有 ${activeInstallIntentCount - personalSelectedSkills.length} 个现役个人意图未进入本次公开目录，不等于不可用。personal source/install/transaction 通过，${skillSupply.data.transaction.campaign_count} 个事务 campaign 全部 terminal；host-integrated 只记录各卡片已有的 observed source snapshot，本快速刷新不重跑宿主 capability discovery。Current/Fresh/E2E 按各项证据分别说明。` : `source=${skillSupply.data.source?.status} install=${skillSupply.data.install?.status} transaction=${skillSupply.data.transaction?.status}`),
  validationRow("Contract coverage（跨控制面合同覆盖）", coveragePassed ? "pass" : "repair", coveragePassed ? "通过" : "BLOCK", coveragePassed ? "现行三个控制面的合同 catalog 与入口覆盖通过；任何入口不得再读取 C 盘规则 authority、Publisher 或 policy epoch。" : `coverage 状态 ${coverage.data.status}，finding ${coverage.data.finding_count ?? "unknown"} 项。`)
];

const unresolved = rows.filter((row) => row.status !== "pass").length;
const ruleBinding = await Promise.all(documentedRuleBindings.rules.map(async (rule) => {
  const descriptor = descriptors.get(rule.logicalId);
  const sourceBytes = await readFile(rule.sourcePath);
  const releasePath = current.required_rule_paths?.[rule.logicalId];
  if (!releasePath) throw new Error(`E release path missing for ${rule.logicalId}`);
  const releaseBytes = await readFile(releasePath);
  const releaseText = releaseBytes.toString("utf8");
  const sourceSha256 = sha256(sourceBytes);
  const releaseSha256 = sha256(releaseBytes);
  if (releaseSha256 !== descriptor.sha256 || releaseBytes.length !== Number(descriptor.bytes)) throw new Error(`E release bytes drifted for ${rule.logicalId}`);
  return {
    logicalId: rule.logicalId,
    sha256: descriptor.sha256,
    bytes: Number(descriptor.bytes),
    characters: releaseText.length,
    lines: (releaseText.match(/\n/g) || []).length + 1,
    sourceSha256,
    sourceBytes: sourceBytes.length,
    sourceMatchesRelease: sourceSha256 === descriptor.sha256 && sourceBytes.length === Number(descriptor.bytes),
    releasePath
  };
}));

const generated = {
  schema: "wly.panel-facts.v2",
  generatedBy: "scripts/refresh-panel-snapshot.mjs",
  observedAt: chinaTime(),
  sourceCommit,
  sourceBranch,
  sourceWorktreeClean: !dirty,
  sourceDirtyCount: sourceDirtyPaths.length,
  sourceDirtyPaths,
  sourceAhead,
  sourceBehind,
  sourceSync: `联网刷新后，HEAD 与 origin/main 为 ${sourceAhead}/${sourceBehind}；工作树${dirty ? `有 ${sourceDirtyPaths.length} 项未激活修改` : "干净"}`,
  repositoryVisibility: sourceRegistration.source.visibility === "PRIVATE" ? "私有" : sourceRegistration.source.visibility === "PUBLIC" ? "公开" : "未知",
  repositoryVisibilityEvidence: "来自项目 Registry 登记；GitHub 实时可见性仍由 Git Owner 单独回读",
  ruleBinding,
  skills: { activeInstallIntent: activeInstallIntentCount, personalSelectedCount: personalSelectedSkills.length, hostIntegratedCount: hostIntegratedSkills.length, hostIntegratedDiscovery: "not_rerun_by_agents_snapshot_refresh", selectedPublicCount: skills.length, transactionCampaignCount: skillSupply.data.transaction.campaign_count },
  authority: {
    status: "e_rules_active_verified",
    statusLabel: `${current.release_id} 活动规则已验证`,
    generation: current.release_id,
    generationId: current.release_id,
    releaseId: current.release_id,
    gitCommit: current.git_commit,
    rulesetSha256: current.ruleset_sha256,
    releaseRecordSha256: current.release_record_sha256,
    releaseRecordPath,
    releaseCreatedAtUtc: releaseRecord.created_at_utc,
    releaseSourceWorktreeClean: releaseRecord.source_worktree_clean,
    remoteMainContainsCommit: releaseRecord.remote_main_contains_commit,
    pointerRevision: release.pointer.pointer_revision,
    pointerSha256: release.pointer_sha256,
    activatedAtUtc: release.pointer.activated_at_utc,
    previous: release.pointer.previous,
    activationVerified: true,
    requiredRulesVerified: true,
    sourceMatchesRelease: ruleBinding.every((item) => item.sourceMatchesRelease),
    legacyCState: "retired_recovery_only"
  },
  validation: {
    label: unresolved ? `还有 ${unresolved} 层未闭合` : "全部当前验证层已闭合",
    summary: unresolved ? `E rules 活动且五规则闭包通过，但仍有 ${unresolved} 个独立验证层没有通过。` : "E rules current、五规则闭包、本地总测、个人能力供应和跨控制面合同覆盖均通过。",
    rows,
    failures: failedTests
  }
};

const payloadSha256 = sha256(Buffer.from(JSON.stringify(generated), "utf8"));
generated.integrity = { schema: "wly.panel-facts-integrity.v1", algorithm: "sha256", payloadSha256 };
const generatedSource = `// Generated by scripts/refresh-panel-snapshot.mjs. Do not hand-edit observed facts.\nexport const generatedPanelFacts = ${JSON.stringify(generated, null, 2)};\n`;
assertNoSecretValue(generatedSource, "generated panel facts");
const temporaryOutputPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.${process.pid}.${Date.now()}.tmp`);
try {
  await writeFile(temporaryOutputPath, generatedSource, "utf8");
  await rename(temporaryOutputPath, outputPath);
} finally {
  await unlink(temporaryOutputPath).catch((error) => {
    if (error?.code !== "ENOENT") throw error;
  });
}
releaseRefreshLock();

process.stdout.write(`${JSON.stringify({ status: "generated", output: outputPath, sourceCommit, releaseId: current.release_id, rulesetSha256: current.ruleset_sha256, releaseValidation: releaseValidationPassed ? "pass" : "repair", fullLocalTests: "not_rerun_by_fast_snapshot_refresh", skillSupply: supplyPassed ? "pass" : "repair", coverage: coverage.data.status, unresolved }, null, 2)}\n`);

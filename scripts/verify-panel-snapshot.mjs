import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { generatedPanelFacts } from "../app/panel-facts.generated.js";
import { rulesSnapshot } from "../app/content-core.js";
import { skills } from "../app/content-skills.js";

const failures = [];
function requireFact(condition, code, detail) {
  if (!condition) failures.push({ code, detail });
}

const payload = JSON.parse(JSON.stringify(generatedPanelFacts));
const integrity = payload.integrity;
delete payload.integrity;
const actualPayloadSha256 = createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex");

const liveReleaseResult = spawnSync(
  "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
  ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", "E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1", "-Mode", "Inspect", "-Json"],
  { encoding: "utf8", windowsHide: true, maxBuffer: 8 * 1024 * 1024 }
);
let liveRelease = null;
try {
  const start = liveReleaseResult.stdout.indexOf("{");
  const end = liveReleaseResult.stdout.lastIndexOf("}");
  liveRelease = JSON.parse(liveReleaseResult.stdout.slice(start, end + 1));
} catch {
  failures.push({ code: "live_e_release_read_failed", detail: liveReleaseResult.stderr?.trim() || "no JSON" });
}

requireFact(payload.schema === "wly.panel-facts.v2", "snapshot_schema_invalid", payload.schema);
requireFact(payload.generatedBy === "scripts/refresh-panel-snapshot.mjs", "snapshot_generator_invalid", payload.generatedBy);
requireFact(integrity?.schema === "wly.panel-facts-integrity.v1", "snapshot_integrity_schema_invalid", integrity?.schema);
requireFact(integrity?.algorithm === "sha256", "snapshot_integrity_algorithm_invalid", integrity?.algorithm);
requireFact(integrity?.payloadSha256 === actualPayloadSha256, "snapshot_payload_commitment_mismatch", `${integrity?.payloadSha256} != ${actualPayloadSha256}`);
requireFact(/^[a-f0-9]{40}$/.test(payload.sourceCommit), "snapshot_source_commit_invalid", payload.sourceCommit);
requireFact(payload.sourceBranch === "main", "snapshot_source_branch_invalid", payload.sourceBranch);
requireFact(Number.isInteger(payload.sourceAhead) && Number.isInteger(payload.sourceBehind), "snapshot_source_sync_counts_invalid", `${payload.sourceAhead}/${payload.sourceBehind}`);
requireFact(Number.isInteger(payload.sourceDirtyCount) && Array.isArray(payload.sourceDirtyPaths) && payload.sourceDirtyCount === payload.sourceDirtyPaths.length, "snapshot_source_dirty_state_invalid", `${payload.sourceDirtyCount}/${payload.sourceDirtyPaths?.length}`);
requireFact(typeof payload.sourceSync === "string" && payload.sourceSync.includes(`${payload.sourceAhead}/${payload.sourceBehind}`), "snapshot_source_sync_not_described", payload.sourceSync);
requireFact(["私有", "公开", "未知"].includes(payload.repositoryVisibility), "snapshot_repository_visibility_invalid", payload.repositoryVisibility);
requireFact(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}（中国时间）$/.test(payload.observedAt), "snapshot_observed_at_invalid", payload.observedAt);

const authority = payload.authority || {};
requireFact(authority.status === "e_rules_active_verified", "snapshot_e_rules_status_invalid", authority.status);
requireFact(/^E\d+$/.test(authority.releaseId || ""), "snapshot_e_release_id_invalid", authority.releaseId);
requireFact(authority.generation === authority.releaseId && authority.generationId === authority.releaseId, "snapshot_e_release_alias_drift", `${authority.generation}/${authority.generationId}/${authority.releaseId}`);
requireFact(/^[a-f0-9]{40}$/.test(authority.gitCommit || ""), "snapshot_e_release_commit_invalid", authority.gitCommit);
for (const field of ["rulesetSha256", "releaseRecordSha256", "pointerSha256"]) requireFact(/^[a-f0-9]{64}$/.test(authority[field] || ""), `snapshot_${field}_invalid`, authority[field]);
requireFact(Number.isInteger(authority.pointerRevision) && authority.pointerRevision >= 1, "snapshot_pointer_revision_invalid", authority.pointerRevision);
requireFact(authority.activationVerified === true && authority.requiredRulesVerified === true, "snapshot_e_release_not_verified", `${authority.activationVerified}/${authority.requiredRulesVerified}`);
requireFact(authority.legacyCState === "retired_recovery_only", "snapshot_legacy_c_state_invalid", authority.legacyCState);
requireFact(authority.previous === null || /^E\d+$/.test(authority.previous?.release_id || ""), "snapshot_previous_release_invalid", authority.previous?.release_id);
requireFact(liveReleaseResult.status === 0 && liveRelease?.status === "pass" && liveRelease?.reason === "e_rules_active_verified", "live_e_release_not_verified", `${liveReleaseResult.status}/${liveRelease?.status}/${liveRelease?.reason}`);
requireFact(liveRelease?.verified_current?.release_id === authority.releaseId, "snapshot_live_release_id_drift", `${authority.releaseId}/${liveRelease?.verified_current?.release_id}`);
requireFact(liveRelease?.verified_current?.git_commit === authority.gitCommit, "snapshot_live_release_commit_drift", `${authority.gitCommit}/${liveRelease?.verified_current?.git_commit}`);
requireFact(liveRelease?.verified_current?.ruleset_sha256 === authority.rulesetSha256, "snapshot_live_ruleset_drift", `${authority.rulesetSha256}/${liveRelease?.verified_current?.ruleset_sha256}`);
requireFact(liveRelease?.pointer_sha256 === authority.pointerSha256, "snapshot_live_pointer_drift", `${authority.pointerSha256}/${liveRelease?.pointer_sha256}`);

const documentedRules = new Map(rulesSnapshot.rules.map((rule) => [rule.logicalId, rule]));
const boundRules = new Map((payload.ruleBinding || []).map((rule) => [rule.logicalId, rule]));
requireFact(boundRules.size === documentedRules.size && documentedRules.size === 5, "snapshot_rule_binding_count_invalid", `${boundRules.size}/${documentedRules.size}`);
for (const [logicalId, rule] of documentedRules) {
  const bound = boundRules.get(logicalId);
  requireFact(bound?.sha256 === rule.sha256 && Number(bound?.bytes) === Number(rule.bytes), "snapshot_rule_binding_mismatch", logicalId);
  requireFact(/^[a-f0-9]{64}$/.test(bound?.sourceSha256 || ""), "snapshot_source_sha_invalid", logicalId);
  requireFact(Number.isInteger(bound?.sourceBytes) && bound.sourceBytes >= 0, "snapshot_source_bytes_invalid", logicalId);
  requireFact(typeof bound?.sourceMatchesRelease === "boolean", "snapshot_source_relation_missing", logicalId);
  const expectedRoot = path.win32.join("E:\\.agents\\releases", authority.releaseId).toLowerCase() + "\\";
  requireFact(path.win32.resolve(bound?.releasePath || "").toLowerCase().startsWith(expectedRoot), "snapshot_release_path_outside_current", `${logicalId}:${bound?.releasePath}`);
  const liveDescriptor = liveRelease?.verified_current?.files?.find((item) => item.logical_id === logicalId);
  requireFact(liveDescriptor?.sha256 === bound?.sha256 && Number(liveDescriptor?.bytes) === Number(bound?.bytes), "snapshot_live_rule_descriptor_drift", logicalId);
}
requireFact(authority.releaseId === rulesSnapshot.releaseId, "snapshot_release_id_mismatch", `${authority.releaseId}/${rulesSnapshot.releaseId}`);
requireFact(authority.rulesetSha256 === rulesSnapshot.rulesetSha256, "snapshot_ruleset_mismatch", `${authority.rulesetSha256}/${rulesSnapshot.rulesetSha256}`);
requireFact(authority.status === rulesSnapshot.status, "snapshot_authority_status_mismatch", `${authority.status}/${rulesSnapshot.status}`);

requireFact(payload.skills.selectedPublicCount === skills.length, "snapshot_selected_skill_count_mismatch", `${payload.skills.selectedPublicCount}/${skills.length}`);
requireFact(payload.skills.activeInstallIntent >= payload.skills.selectedPublicCount, "snapshot_skill_supply_count_invalid", `${payload.skills.activeInstallIntent}/${payload.skills.selectedPublicCount}`);
requireFact(Array.isArray(payload.validation?.rows) && payload.validation.rows.length >= 5, "snapshot_validation_rows_invalid", String(payload.validation?.rows?.length));
requireFact(Array.isArray(payload.validation?.failures), "snapshot_validation_failures_invalid", typeof payload.validation?.failures);
const releaseValidatorRow = payload.validation?.rows?.find((row) => row.layer.startsWith("E release validator"));
if (releaseValidatorRow?.status === "repair") requireFact(payload.validation.failures.length > 0, "snapshot_failed_tests_not_named", releaseValidatorRow?.status);
const sourceRow = payload.validation?.rows?.find((row) => row.layer.startsWith("Source checkout"));
if (payload.sourceDirtyCount > 0 || payload.sourceCommit !== authority.gitCommit) requireFact(sourceRow?.status === "repair", "snapshot_dirty_source_not_disclosed", sourceRow?.status);

const report = {
  schema: "wly.panel-snapshot-binding.v2",
  status: failures.length ? "block" : "pass",
  source_commit: payload.sourceCommit,
  source_dirty_count: payload.sourceDirtyCount,
  release_id: authority.releaseId,
  release_commit: authority.gitCommit,
  ruleset_sha256: authority.rulesetSha256,
  rule_binding_count: boundRules.size,
  selected_skill_count: payload.skills.selectedPublicCount,
  active_install_intent_count: payload.skills.activeInstallIntent,
  payload_sha256: actualPayloadSha256,
  finding_count: failures.length,
  findings: failures
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (failures.length) process.exitCode = 1;

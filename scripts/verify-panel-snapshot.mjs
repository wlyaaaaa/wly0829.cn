import { createHash } from "node:crypto";
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

requireFact(payload.schema === "wly.panel-facts.v1", "snapshot_schema_invalid", payload.schema);
requireFact(payload.generatedBy === "scripts/refresh-panel-snapshot.mjs", "snapshot_generator_invalid", payload.generatedBy);
requireFact(integrity?.schema === "wly.panel-facts-integrity.v1", "snapshot_integrity_schema_invalid", integrity?.schema);
requireFact(integrity?.algorithm === "sha256", "snapshot_integrity_algorithm_invalid", integrity?.algorithm);
requireFact(integrity?.payloadSha256 === actualPayloadSha256, "snapshot_payload_commitment_mismatch", `${integrity?.payloadSha256} != ${actualPayloadSha256}`);
requireFact(/^[a-f0-9]{40}$/.test(payload.sourceCommit), "snapshot_source_commit_invalid", payload.sourceCommit);
requireFact(payload.sourceBranch === "main", "snapshot_source_branch_invalid", payload.sourceBranch);
requireFact(payload.sourceSync === "联网刷新后，HEAD 与 origin/main 一致", "snapshot_source_sync_not_live", payload.sourceSync);
requireFact(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}（中国时间）$/.test(payload.observedAt), "snapshot_observed_at_invalid", payload.observedAt);

const documentedRules = new Map(rulesSnapshot.rules.map((rule) => [rule.logicalId, rule]));
const boundRules = new Map((payload.ruleBinding || []).map((rule) => [rule.logicalId, rule]));
requireFact(boundRules.size === documentedRules.size && documentedRules.size === 5, "snapshot_rule_binding_count_invalid", `${boundRules.size}/${documentedRules.size}`);
for (const [logicalId, rule] of documentedRules) {
  const bound = boundRules.get(logicalId);
  requireFact(bound?.sha256 === rule.sha256 && Number(bound?.bytes) === Number(rule.bytes), "snapshot_rule_binding_mismatch", logicalId);
  requireFact(/^[a-f0-9]{64}$/.test(bound?.candidateSha256 || ""), "snapshot_candidate_sha_invalid", logicalId);
  requireFact(Number.isInteger(bound?.candidateBytes) && bound.candidateBytes >= 0, "snapshot_candidate_bytes_invalid", logicalId);
  requireFact(typeof bound?.candidateMatchesActive === "boolean", "snapshot_candidate_relation_missing", logicalId);
}
requireFact(payload.authority.generation === rulesSnapshot.generation, "snapshot_generation_mismatch", `${payload.authority.generation}/${rulesSnapshot.generation}`);
requireFact(payload.authority.generationId === rulesSnapshot.generationId, "snapshot_generation_id_mismatch", payload.authority.generationId);
requireFact(payload.authority.status === rulesSnapshot.status, "snapshot_authority_status_mismatch", `${payload.authority.status}/${rulesSnapshot.status}`);
requireFact(payload.authority.requiredRulesVerified === true && rulesSnapshot.requiredRulesVerified === true, "snapshot_rules_not_verified", "requiredRulesVerified must be true");
requireFact(payload.authority.productionActivation === rulesSnapshot.productionActivation, "snapshot_production_binding_mismatch", String(payload.authority.productionActivation));

requireFact(payload.skills.selectedPublicCount === skills.length, "snapshot_selected_skill_count_mismatch", `${payload.skills.selectedPublicCount}/${skills.length}`);
requireFact(payload.skills.activeInstallIntent >= payload.skills.selectedPublicCount, "snapshot_skill_supply_count_invalid", `${payload.skills.activeInstallIntent}/${payload.skills.selectedPublicCount}`);
requireFact(Array.isArray(payload.validation?.rows) && payload.validation.rows.length === 5, "snapshot_validation_rows_invalid", String(payload.validation?.rows?.length));
requireFact(Array.isArray(payload.validation?.failures), "snapshot_validation_failures_invalid", typeof payload.validation?.failures);
const localTestRow = payload.validation?.rows?.find((row) => row.layer.startsWith("Local tests"));
if (localTestRow?.status !== "pass") {
  requireFact(payload.validation.failures.length > 0, "snapshot_failed_tests_not_named", localTestRow?.status);
}

const report = {
  schema: "wly.panel-snapshot-binding.v1",
  status: failures.length ? "block" : "pass",
  source_commit: payload.sourceCommit,
  generation: payload.authority.generation,
  rule_binding_count: boundRules.size,
  selected_skill_count: payload.skills.selectedPublicCount,
  active_install_intent_count: payload.skills.activeInstallIntent,
  payload_sha256: actualPayloadSha256,
  finding_count: failures.length,
  findings: failures
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (failures.length) process.exitCode = 1;

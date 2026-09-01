import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const bundleIndex = process.argv.indexOf("--bundle");
const bundleArg = bundleIndex >= 0 ? process.argv[bundleIndex + 1] : "";
if (!bundleArg) throw new Error("--bundle <path> is required");

const bundlePath = path.resolve(projectRoot, bundleArg);
const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
const bundle = JSON.parse(await readFile(bundlePath, "utf8"));
const enabled = registry.projects.filter((item) => item.enabled).sort((left, right) => left.order - right.order);
const registryById = new Map(enabled.map((item) => [item.id, item]));
const globalSurfaceDefinitions = registry.global_surfaces || [];
const globalSurfaceById = new Map(globalSurfaceDefinitions.map((item) => [item.id, item]));
const findings = [];

function requireFact(condition, code, detail) {
  if (!condition) findings.push({ code, detail });
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function validSha(value) {
  return /^[a-f0-9]{64}$/.test(String(value || ""));
}

requireFact(bundle.schema === "wly.ai-panel-refresh-result.v2", "bundle_schema_invalid", bundle.schema);
requireFact(["targeted", "all"].includes(bundle.mode), "bundle_mode_invalid", bundle.mode);
requireFact(Array.isArray(bundle.projects) && bundle.projects.length > 0, "bundle_projects_missing", typeof bundle.projects);
requireFact(Array.isArray(bundle.source_deltas), "bundle_source_deltas_missing", typeof bundle.source_deltas);
requireFact(Array.isArray(bundle.global_surfaces), "bundle_global_surfaces_missing", typeof bundle.global_surfaces);
requireFact(Array.isArray(bundle.auto_repairs), "bundle_auto_repairs_missing", typeof bundle.auto_repairs);
requireFact(Array.isArray(bundle.blockers), "bundle_blockers_missing", typeof bundle.blockers);

const projectResults = Array.isArray(bundle.projects) ? bundle.projects : [];
const ids = projectResults.map((item) => item.id);
requireFact(new Set(ids).size === ids.length, "bundle_project_duplicate", ids.join(","));
if (bundle.mode === "all") requireFact(JSON.stringify(ids) === JSON.stringify(enabled.map((item) => item.id)), "bundle_all_closure_invalid", ids.join(","));
if (bundle.mode === "targeted") requireFact(ids.length === 1, "bundle_targeted_count_invalid", String(ids.length));

const semanticBuckets = ["added", "changed", "retired"];
const sourceDeltas = Array.isArray(bundle.source_deltas) ? bundle.source_deltas : [];
const deltaIds = sourceDeltas.map((item) => item?.project_id);
requireFact(new Set(deltaIds).size === deltaIds.length, "bundle_source_delta_duplicate", deltaIds.join(","));
requireFact(JSON.stringify(deltaIds) === JSON.stringify(ids), "bundle_source_delta_closure_invalid", deltaIds.join(","));

function validSemanticItem(item) {
  return Boolean(item)
    && typeof item === "object"
    && !Array.isArray(item)
    && typeof item.summary === "string"
    && item.summary.trim().length >= 4
    && typeof item.evidence === "string"
    && item.evidence.trim().length >= 4;
}

const allowedSurfaceIds = new Set([
  ...ids.map((id) => `project:${id}`),
  ...globalSurfaceDefinitions.map((surface) => surface.id)
]);
for (const delta of sourceDeltas) {
  requireFact(Boolean(registryById.get(delta?.project_id)), "bundle_source_delta_project_invalid", delta?.project_id);
  requireFact(Boolean(delta?.product) && typeof delta.product === "object" && !Array.isArray(delta.product), "bundle_product_delta_missing", delta?.project_id);
  requireFact(Boolean(delta?.technical) && typeof delta.technical === "object" && !Array.isArray(delta.technical), "bundle_technical_delta_missing", delta?.project_id);
  for (const axis of ["product", "technical"]) {
    for (const bucket of semanticBuckets) {
      const items = delta?.[axis]?.[bucket];
      requireFact(Array.isArray(items), "bundle_semantic_delta_bucket_missing", `${delta?.project_id}:${axis}:${bucket}`);
      for (const item of Array.isArray(items) ? items : []) {
        requireFact(validSemanticItem(item), "bundle_semantic_delta_item_invalid", `${delta?.project_id}:${axis}:${bucket}`);
      }
    }
  }
  requireFact(Array.isArray(delta?.unknowns), "bundle_semantic_delta_unknowns_missing", delta?.project_id);
  for (const unknown of Array.isArray(delta?.unknowns) ? delta.unknowns : []) {
    requireFact(typeof unknown === "string" && unknown.trim().length >= 4, "bundle_semantic_delta_unknown_invalid", delta?.project_id);
  }
  requireFact(Array.isArray(delta?.affected_surfaces), "bundle_semantic_delta_surfaces_missing", delta?.project_id);
  requireFact(new Set(delta?.affected_surfaces || []).size === (delta?.affected_surfaces || []).length, "bundle_semantic_delta_surface_duplicate", delta?.project_id);
  for (const surfaceId of delta?.affected_surfaces || []) {
    requireFact(allowedSurfaceIds.has(surfaceId), "bundle_semantic_delta_surface_invalid", `${delta?.project_id}:${surfaceId}`);
  }
}

for (const result of projectResults) {
  const registration = registryById.get(result.id);
  requireFact(Boolean(registration), "bundle_project_unregistered", result.id);
  if (!registration) continue;
  if (registration.ai_refresh?.mode === "manual_owner_only") {
    requireFact(bundle.manual_owner_request === true, "bundle_manual_owner_request_missing", result.id);
    requireFact(result.manual_owner_request === true, "bundle_project_manual_owner_request_missing", result.id);
  }
  requireFact(result.content_path === registration.ai_refresh.content_path, "bundle_content_path_mismatch", result.id);
  requireFact(["changed", "unchanged", "blocked"].includes(result.status), "bundle_project_status_invalid", `${result.id}:${result.status}`);
  requireFact(validSha(result.old_content_sha256), "bundle_old_content_sha_invalid", result.id);
  requireFact(validSha(result.new_content_sha256), "bundle_new_content_sha_invalid", result.id);
  requireFact(Number.isInteger(result.old_semantic_revision), "bundle_old_semantic_revision_invalid", result.id);
  requireFact(Number.isInteger(result.new_semantic_revision), "bundle_new_semantic_revision_invalid", result.id);
  requireFact(typeof result.material === "boolean", "bundle_materiality_missing", result.id);
  requireFact(typeof result.semantic_change === "boolean", "bundle_semantic_change_missing", result.id);
  requireFact(typeof result.reason === "string" && result.reason.trim().length >= 8, "bundle_reason_missing", result.id);
  const expectedCollectorCommands = registration.ai_refresh.collectors || [];
  const collectors = Array.isArray(result.collectors) ? result.collectors : [];
  requireFact(collectors.length === expectedCollectorCommands.length && expectedCollectorCommands.length >= 1, "bundle_collector_closure_invalid", result.id);
  for (const collector of collectors) {
    requireFact(Boolean(collector) && typeof collector === "object" && !Array.isArray(collector), "bundle_collector_entry_invalid", result.id);
    if (!collector || typeof collector !== "object" || Array.isArray(collector)) continue;
    requireFact(typeof collector.command === "string" && expectedCollectorCommands.includes(collector.command), "bundle_collector_command_unregistered", `${result.id}:${collector.command}`);
    requireFact(["pass", "failed", "error", "blocked", "unknown"].includes(collector.status), "bundle_collector_status_invalid", `${result.id}:${collector.status}`);
    requireFact(Number.isFinite(collector.duration_seconds) && collector.duration_seconds >= 0, "bundle_collector_duration_invalid", `${result.id}:${collector.duration_seconds}`);
    if (result.status !== "blocked") requireFact(collector.status === "pass", "bundle_collector_not_passed", `${result.id}:${collector.command}:${collector.status}`);
  }
  for (const command of expectedCollectorCommands) {
    requireFact(collectors.filter((collector) => collector?.command === command).length === 1, "bundle_collector_command_missing", `${result.id}:${command}`);
  }
  const requirements = registration.ai_refresh.collector_requirements || [];
  const receipts = Array.isArray(result.collector_receipts) ? result.collector_receipts : [];
  requireFact(receipts.length === requirements.length, "bundle_collector_receipt_closure_invalid", result.id);
  for (const requirement of requirements) {
    const matches = receipts.filter((receipt) => receipt?.id === requirement.id);
    requireFact(matches.length === 1, "bundle_collector_receipt_missing", `${result.id}:${requirement.id}`);
    if (matches.length !== 1) continue;
    const receipt = matches[0];
    requireFact(requirement.required_principals.includes(receipt.principal), "bundle_collector_principal_invalid", `${result.id}:${requirement.id}:${receipt.principal}`);
    requireFact(receipt.schema === requirement.expected_schema, "bundle_collector_schema_invalid", `${result.id}:${requirement.id}:${receipt.schema}`);
    requireFact(receipt.pointer_path === requirement.pointer_path, "bundle_collector_pointer_invalid", `${result.id}:${requirement.id}`);
    requireFact(receipt.complete_visibility === requirement.required_evidence.complete_visibility, "bundle_collector_visibility_invalid", `${result.id}:${requirement.id}`);
    requireFact(typeof receipt.generation_id === "string" && receipt.generation_id.length >= 16, "bundle_collector_generation_invalid", `${result.id}:${requirement.id}`);
    requireFact(validSha(receipt.manifest_sha256) && validSha(receipt.artifact_sha256), "bundle_collector_commitment_invalid", `${result.id}:${requirement.id}`);
    requireFact(typeof receipt.observed_at === "string" && receipt.observed_at.length >= 10, "bundle_collector_observed_at_invalid", `${result.id}:${requirement.id}`);
  }
  requireFact(typeof result.observed_at === "string" && result.observed_at.length >= 10, "bundle_observed_at_missing", result.id);

  const contentPath = path.resolve(projectRoot, registration.ai_refresh.content_path);
  const relative = path.relative(projectRoot, contentPath);
  requireFact(relative && !relative.startsWith("..") && !path.isAbsolute(relative), "bundle_content_path_outside_project", result.id);
  const currentSha = sha256(await readFile(contentPath));
  requireFact(currentSha === result.new_content_sha256, "bundle_current_content_mismatch", `${result.id}:${currentSha}`);
  requireFact(result.new_semantic_revision === registration.ai_refresh.semantic_revision, "bundle_registry_semantic_revision_mismatch", result.id);

  if (result.status === "unchanged") {
    requireFact(result.material === false, "bundle_unchanged_material", result.id);
    requireFact(result.old_content_sha256 === result.new_content_sha256, "bundle_unchanged_content_drift", result.id);
    requireFact(result.old_semantic_revision === result.new_semantic_revision, "bundle_unchanged_semantic_drift", result.id);
    requireFact(validSha(result.source_fingerprint), "bundle_unchanged_source_fingerprint_missing", result.id);
  }
  if (result.status === "changed") {
    requireFact(result.material === true, "bundle_changed_not_material", result.id);
    requireFact(result.old_content_sha256 !== result.new_content_sha256, "bundle_changed_content_unchanged", result.id);
    requireFact(validSha(result.source_fingerprint), "bundle_changed_source_fingerprint_missing", result.id);
  }
  if (result.status === "blocked") {
    requireFact(result.material === false, "bundle_blocked_material", result.id);
    requireFact(result.old_content_sha256 === result.new_content_sha256, "bundle_blocked_content_drift", result.id);
  }
  if (result.semantic_change) requireFact(result.new_semantic_revision === result.old_semantic_revision + 1, "bundle_semantic_revision_not_incremented", result.id);
  else requireFact(result.new_semantic_revision === result.old_semantic_revision, "bundle_semantic_revision_unexpected_change", result.id);
}

const globalSurfaceResults = Array.isArray(bundle.global_surfaces) ? bundle.global_surfaces : [];
const globalSurfaceIds = globalSurfaceResults.map((item) => item?.id);
requireFact(new Set(globalSurfaceIds).size === globalSurfaceIds.length, "bundle_global_surface_duplicate", globalSurfaceIds.join(","));
requireFact(JSON.stringify(globalSurfaceIds) === JSON.stringify(globalSurfaceDefinitions.map((item) => item.id)), "bundle_global_surface_closure_invalid", globalSurfaceIds.join(","));
for (const surface of globalSurfaceResults) {
  const definition = globalSurfaceById.get(surface?.id);
  requireFact(Boolean(definition), "bundle_global_surface_unregistered", surface?.id);
  if (!definition) continue;
  requireFact(["changed", "unchanged", "blocked"].includes(surface.status), "bundle_global_surface_status_invalid", `${surface.id}:${surface.status}`);
  requireFact(typeof surface.reason === "string" && surface.reason.trim().length >= 8, "bundle_global_surface_reason_missing", surface.id);
  const files = Array.isArray(surface.files) ? surface.files : [];
  requireFact(JSON.stringify(files.map((item) => item?.path)) === JSON.stringify(definition.content_paths), "bundle_global_surface_files_invalid", surface.id);
  let changedFileCount = 0;
  for (const file of files) {
    requireFact(validSha(file?.old_content_sha256), "bundle_global_surface_old_sha_invalid", `${surface.id}:${file?.path}`);
    requireFact(validSha(file?.new_content_sha256), "bundle_global_surface_new_sha_invalid", `${surface.id}:${file?.path}`);
    const contentPath = path.resolve(projectRoot, file?.path || "");
    const relative = path.relative(projectRoot, contentPath);
    requireFact(relative && !relative.startsWith("..") && !path.isAbsolute(relative), "bundle_global_surface_path_outside_project", `${surface.id}:${file?.path}`);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) continue;
    const currentSha = sha256(await readFile(contentPath));
    requireFact(currentSha === file.new_content_sha256, "bundle_global_surface_current_content_mismatch", `${surface.id}:${file.path}:${currentSha}`);
    if (file.old_content_sha256 !== file.new_content_sha256) changedFileCount += 1;
  }
  if (surface.status === "changed") requireFact(changedFileCount > 0, "bundle_global_surface_changed_without_drift", surface.id);
  else requireFact(changedFileCount === 0, "bundle_global_surface_unchanged_with_drift", surface.id);
}

const changedSurfaceIds = new Set([
  ...projectResults.filter((item) => item.status === "changed").map((item) => `project:${item.id}`),
  ...globalSurfaceResults.filter((item) => item.status === "changed").map((item) => item.id)
]);
const declaredSurfaceIds = new Set(sourceDeltas.flatMap((item) => item?.affected_surfaces || []));
requireFact(
  JSON.stringify([...declaredSurfaceIds].sort()) === JSON.stringify([...changedSurfaceIds].sort()),
  "bundle_semantic_delta_surface_closure_invalid",
  JSON.stringify({ declared: [...declaredSurfaceIds].sort(), changed: [...changedSurfaceIds].sort() })
);
const semanticItemCount = sourceDeltas.reduce((count, delta) => count + ["product", "technical"].reduce((axisCount, axis) => axisCount + semanticBuckets.reduce((bucketCount, bucket) => bucketCount + (Array.isArray(delta?.[axis]?.[bucket]) ? delta[axis][bucket].length : 0), 0), 0), 0);
if (changedSurfaceIds.size > 0) requireFact(semanticItemCount > 0, "bundle_changed_without_semantic_delta", String(changedSurfaceIds.size));
else requireFact(semanticItemCount === 0, "bundle_noop_with_semantic_delta", String(semanticItemCount));

const counts = {
  changed: projectResults.filter((item) => item.status === "changed").length,
  unchanged: projectResults.filter((item) => item.status === "unchanged").length,
  blocked: projectResults.filter((item) => item.status === "blocked").length
};
requireFact(projectResults.length === counts.changed + counts.unchanged + counts.blocked, "bundle_result_partition_invalid", JSON.stringify(counts));

const report = {
  schema: "wly.ai-panel-refresh-verification.v2",
  status: findings.length ? "block" : "pass",
  mode: bundle.mode,
  project_count: projectResults.length,
  counts,
  global_surface_counts: {
    changed: globalSurfaceResults.filter((item) => item.status === "changed").length,
    unchanged: globalSurfaceResults.filter((item) => item.status === "unchanged").length,
    blocked: globalSurfaceResults.filter((item) => item.status === "blocked").length
  },
  semantic_delta_item_count: semanticItemCount,
  auto_repair_count: bundle.auto_repairs?.length || 0,
  blocker_count: bundle.blockers?.length || 0,
  finding_count: findings.length,
  findings
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (findings.length) process.exitCode = 1;

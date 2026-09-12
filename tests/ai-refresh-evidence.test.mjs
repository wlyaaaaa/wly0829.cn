import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const verifier = path.join(projectRoot, "scripts", "verify-ai-panel-refresh.mjs");
const planner = path.join(projectRoot, "scripts", "prepare-ai-panel-refresh.mjs");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function refreshPlan(projectId) {
  return JSON.parse(execFileSync(process.execPath, [planner, "--project", projectId], {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true
  }));
}

function unchangedBundle(plan) {
  const item = plan.selected_projects[0];
  return {
    schema: "wly.ai-panel-refresh-result.v2",
    mode: "targeted",
    manual_owner_request: false,
    projects: [{
      id: item.id,
      status: "unchanged",
      content_path: item.content_path,
      old_content_sha256: item.content_sha256,
      new_content_sha256: item.content_sha256,
      old_semantic_revision: item.semantic_revision,
      new_semantic_revision: item.semantic_revision,
      source_fingerprint: sha256(`bounded-source:${item.id}`),
      material: false,
      semantic_change: false,
      manual_owner_request: null,
      reason: "a bounded current observation found no material user-facing change",
      observed_at: "2026-09-09T22:00:00Z",
      collectors: [{ command: item.collectors[0], status: "pass", duration_seconds: 0.1 }],
      collector_receipts: []
    }],
    source_deltas: [{
      project_id: item.id,
      product: { added: [], changed: [], retired: [] },
      technical: { added: [], changed: [], retired: [] },
      unknowns: [],
      affected_surfaces: []
    }],
    global_surfaces: plan.global_surfaces.map((surface) => ({
      id: surface.id,
      status: "unchanged",
      reason: "the bounded project review does not change this derived global surface",
      files: surface.content_files.map((file) => ({
        path: file.path,
        old_content_sha256: file.content_sha256,
        new_content_sha256: file.content_sha256
      }))
    })),
    auto_repairs: [],
    blockers: []
  };
}

async function verify(bundlePath, bundle) {
  await writeFile(bundlePath, JSON.stringify(bundle, null, 2), "utf8");
  return spawnSync(process.execPath, [verifier, "--bundle", bundlePath], {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true
  });
}

test("AI refresh evidence accepts bounded declared collectors and requires receipts only for fresh SYSTEM snapshots", async () => {
  const plan = refreshPlan("pcconfig");
  const bundle = unchangedBundle(plan);
  const tempRoot = await mkdtemp(path.join(tmpdir(), "wly-ai-refresh-evidence-"));
  const bundlePath = path.join(tempRoot, "bundle.json");
  try {
    const bounded = await verify(bundlePath, bundle);
    assert.equal(bounded.status, 0, bounded.stdout);

    const unknown = structuredClone(bundle);
    unknown.projects[0].collectors.push({ command: "invented collector --pass", status: "pass", duration_seconds: 0.1 });
    const unknownRejected = await verify(bundlePath, unknown);
    assert.notEqual(unknownRejected.status, 0);
    assert.match(unknownRejected.stdout, /bundle_collector_command_unregistered/);

    const duplicate = structuredClone(bundle);
    duplicate.projects[0].collectors.push(structuredClone(duplicate.projects[0].collectors[0]));
    const duplicateRejected = await verify(bundlePath, duplicate);
    assert.notEqual(duplicateRejected.status, 0);
    assert.match(duplicateRejected.stdout, /bundle_collector_command_duplicate/);

    const freshSystem = structuredClone(bundle);
    const systemCollector = plan.selected_projects[0].collectors.find((command) => command.includes("SYSTEM/Administrator"));
    assert.ok(systemCollector, "pcconfig plan must expose its receipt-bound SYSTEM collector");
    freshSystem.projects[0].collectors = [{ command: systemCollector, status: "pass", duration_seconds: 0.1 }];
    const missingReceipt = await verify(bundlePath, freshSystem);
    assert.notEqual(missingReceipt.status, 0);
    assert.match(missingReceipt.stdout, /bundle_collector_receipt_missing/);

    const freshWithReceipt = structuredClone(freshSystem);
    freshWithReceipt.projects[0].collector_receipts = [{
      id: "pcconfig-task-definitions",
      principal: "SYSTEM",
      schema: "pcconfig.tasks.v1",
      pointer_path: "E:\\PCConfig\\state\\generated-publications\\task-scan\\current.json",
      complete_visibility: true,
      generation_id: "taskscan-20260909t220000-3ff5ec92330242fc",
      manifest_sha256: "c7142da1c440b1fda250c44fb7c0e60029e5f5e2e653140b7a025868921e98d8",
      artifact_sha256: "1b1e2da533baed1eb73dfc81aad70a9f43ebf904e28e2a54b4defd4b2fa3456f",
      observed_at: "2026-09-09T22:00:01Z"
    }];
    const freshAccepted = await verify(bundlePath, freshWithReceipt);
    assert.equal(freshAccepted.status, 0, freshAccepted.stdout);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("AI refresh all closure retains unrequested manual snapshots without claiming fresh source evidence", async () => {
  const plan = JSON.parse(execFileSync(process.execPath, [planner, "--all"], {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true
  }));
  const bundle = unchangedBundle(plan);
  bundle.mode = "all";
  bundle.projects = plan.selected_projects.map((item) => {
    const result = unchangedBundle({ ...plan, selected_projects: [item] }).projects[0];
    result.collectors = [];
    if (item.refresh_mode === "manual_owner_only") {
      Object.assign(result, {
        retained_manual_snapshot: true,
        manual_owner_request: false,
        source_fingerprint: null,
        observed_at: item.observed_at,
        reason: "retained the previous website snapshot without reading or refreshing its source"
      });
    }
    return result;
  });
  bundle.source_deltas = plan.selected_projects.map((item) => ({ ...structuredClone(bundle.source_deltas[0]), project_id: item.id }));
  const manualIndex = bundle.projects.findIndex((item) => item.retained_manual_snapshot === true);
  const automaticIndex = bundle.projects.findIndex((item) => item.retained_manual_snapshot !== true);
  assert.ok(manualIndex >= 0 && automaticIndex >= 0);
  const tempRoot = await mkdtemp(path.join(tmpdir(), "wly-ai-refresh-retained-"));
  const bundlePath = path.join(tempRoot, "bundle.json");
  try {
    const accepted = await verify(bundlePath, bundle);
    assert.equal(accepted.status, 0, accepted.stdout);
    assert.equal(JSON.parse(accepted.stdout).project_count, plan.selected_projects.length);

    const omittedRequests = structuredClone(bundle);
    delete omittedRequests.manual_owner_request;
    for (const item of omittedRequests.projects.filter((item) => item.retained_manual_snapshot)) delete item.manual_owner_request;
    const omittedAccepted = await verify(bundlePath, omittedRequests);
    assert.equal(omittedAccepted.status, 0, omittedAccepted.stdout);

    const cases = [
      ["missing retention marker", (value) => { delete value.projects[manualIndex].retained_manual_snapshot; }, /bundle_manual_owner_request_missing/],
      ["automatic project marked retained", (value) => { value.projects[automaticIndex].retained_manual_snapshot = true; }, /bundle_retained_manual_project_invalid/],
      ["changed manual project", (value) => { value.projects[manualIndex].status = "changed"; }, /bundle_retained_manual_status_invalid/],
      ["blocked manual project", (value) => { value.projects[manualIndex].status = "blocked"; }, /bundle_retained_manual_status_invalid/],
      ["bundle request conflicts with retention", (value) => { value.manual_owner_request = true; }, /bundle_retained_manual_bundle_request_invalid/],
      ["project request conflicts with retention", (value) => { value.projects[manualIndex].manual_owner_request = true; }, /bundle_retained_manual_project_request_invalid/],
      ["content drift", (value) => { value.projects[manualIndex].old_content_sha256 = "0".repeat(64); }, /bundle_retained_manual_content_drift/],
      ["semantic revision drift", (value) => { value.projects[manualIndex].old_semantic_revision -= 1; }, /bundle_retained_manual_semantic_drift/],
      ["materiality claim", (value) => { value.projects[manualIndex].material = true; }, /bundle_retained_manual_change_claimed/],
      ["semantic change claim", (value) => { value.projects[manualIndex].semantic_change = true; }, /bundle_retained_manual_change_claimed/],
      ["collector claim", (value) => { value.projects[manualIndex].collectors = [{ command: plan.selected_projects[manualIndex].collectors[0], status: "pass", duration_seconds: 0.1 }]; }, /bundle_retained_manual_collectors_present/],
      ["receipt claim", (value) => { value.projects[manualIndex].collector_receipts = [{ id: "unrequested-evidence" }]; }, /bundle_retained_manual_receipts_present/],
      ["fabricated source fingerprint", (value) => { value.projects[manualIndex].source_fingerprint = sha256("unread source"); }, /bundle_retained_manual_source_fingerprint_invalid/],
      ["missing explicit null source fingerprint", (value) => { delete value.projects[manualIndex].source_fingerprint; }, /bundle_retained_manual_source_fingerprint_invalid/],
      ["manual attribution to a global surface", (value) => { value.source_deltas[manualIndex].affected_surfaces = [plan.global_surfaces[0].id]; }, /bundle_retained_manual_affected_surfaces_present/]
    ];
    for (const axis of ["product", "technical"]) {
      for (const bucket of ["added", "changed", "retired"]) {
        cases.push([`${axis} ${bucket} source claim`, (value) => {
          value.source_deltas[manualIndex][axis][bucket] = [{ summary: "unrequested source conclusion", evidence: "no source observation was authorized" }];
        }, /bundle_retained_manual_semantic_delta_present/]);
      }
    }
    for (const [label, mutate, expected] of cases) {
      const invalid = structuredClone(bundle);
      mutate(invalid);
      const rejected = await verify(bundlePath, invalid);
      assert.notEqual(rejected.status, 0, `${label}: ${rejected.stdout}`);
      assert.match(rejected.stdout, expected, label);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

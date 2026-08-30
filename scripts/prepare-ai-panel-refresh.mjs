import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { panelSnapshot, projectCatalog } from "../app/site-content.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const registryPath = path.join(projectRoot, "config", "panel-projects.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));

const allRequested = process.argv.includes("--all");
const manualOwnerRequest = process.argv.includes("--manual-owner-request");
const projectIndex = process.argv.indexOf("--project");
const projectId = projectIndex >= 0 ? process.argv[projectIndex + 1] : "";

if (allRequested === Boolean(projectId)) {
  throw new Error("Choose exactly one refresh mode: --project <project-id> or --all");
}

const enabled = registry.projects.filter((item) => item.enabled).sort((left, right) => left.order - right.order);
const selected = allRequested ? enabled : enabled.filter((item) => item.id === projectId);
if (!selected.length) throw new Error(`Unknown or disabled panel project: ${projectId}`);
const manualSelected = selected.filter((item) => item.ai_refresh?.mode === "manual_owner_only");

function safeContentPath(relativePath) {
  const resolved = path.resolve(projectRoot, relativePath);
  const relative = path.relative(projectRoot, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Invalid content path: ${relativePath}`);
  return resolved;
}

const projects = [];
for (const registration of selected) {
  const entry = projectCatalog.find((candidate) => candidate.registration.id === registration.id);
  if (!entry) throw new Error(`Registered content package is not loaded: ${registration.id}`);
  const contentPath = safeContentPath(registration.ai_refresh.content_path);
  const contentBytes = await readFile(contentPath);
  const isAgents = registration.id === "agents";
  projects.push({
    id: registration.id,
    order: registration.order,
    title: registration.title,
    route: registration.route,
    source: registration.source,
    presentation_mode: registration.presentation_mode,
    refresh_mode: registration.ai_refresh.mode || "event_driven_material",
    automatic_handoff: registration.ai_refresh.automatic_handoff !== false,
    manual_owner_request: registration.ai_refresh.mode === "manual_owner_only" ? manualOwnerRequest : null,
    refresh_scope: registration.ai_refresh.scope,
    content_path: registration.ai_refresh.content_path,
    content_sha256: createHash("sha256").update(contentBytes).digest("hex"),
    semantic_revision: registration.ai_refresh.semantic_revision,
    source_fingerprint: null,
    source_fingerprint_state: registration.ai_refresh.mode === "manual_owner_only"
      ? "Fresh Owner evidence is allowed only after an explicit owner refresh request"
      : "AI must populate from fresh Owner evidence after collectors complete",
    observed_at: isAgents ? panelSnapshot.observedAt : entry.project.currentState?.observedAt || null,
    current_gap_count: isAgents
      ? panelSnapshot.validation.rows.filter((row) => row.status !== "pass").length
      : entry.project.currentState?.gaps?.length || 0,
    collectors: registration.ai_refresh.collectors,
    collector_requirements: registration.ai_refresh.collector_requirements || [],
    conditional_collectors: registration.ai_refresh.conditional_collectors || [],
    impact_sources: (registration.impact_sources || []).map((source) => ({ kind: source.kind, paths: source.paths || [] }))
  });
}

const result = {
  schema: "wly.ai-panel-refresh-plan.v1",
  status: manualSelected.length && !manualOwnerRequest ? "manual_owner_request_required" : "ready_for_ai",
  mode: allRequested ? "all" : "targeted",
  manual_owner_request: manualOwnerRequest,
  manual_project_ids: manualSelected.map((item) => item.id),
  semantic_writer: registry.refresh_policy.semantic_writer,
  selected_project_count: projects.length,
  selected_projects: projects,
  materiality: {
    default: registry.refresh_policy.default_change_policy,
    source_event_threshold: registry.refresh_policy.task_creation_threshold,
    small_change_policy: registry.refresh_policy.small_change_policy,
    manual_only: "manual_owner_only projects ignore every source, rule and Skill event; only an explicit owner request may refresh them"
  },
  anti_bloat: {
    content_update: registry.refresh_policy.anti_append_policy,
    evolution: registry.refresh_policy.evolution_policy,
    full_refresh: registry.refresh_policy.full_refresh_rule
  },
  boundaries: {
    rule_refresh: registry.refresh_policy.rule_refresh_boundary,
    fact_collectors: registry.refresh_policy.fact_collector_boundary,
    background_sync: "forbidden",
    publication: registry.refresh_policy.publication_mode,
    manual_projects: manualSelected.length
      ? "This plan may proceed for manual_owner_only projects only when manual_owner_request=true"
      : "No manual_owner_only project is selected"
  },
  ai_workflow: [
    manualSelected.length && !manualOwnerRequest
      ? "Stop before evidence collection: a manual_owner_only project is selected without an explicit owner refresh request."
      : "Read this plan and the current project content before collecting evidence.",
    "Run only the selected project collectors and any decision-relevant Owner readbacks.",
    "Compare evidence with the current page; default to no file change.",
    "Repair safe, reversible, in-scope source defects through their real Owner when independently verifiable.",
    "When material drift exists, replace, merge or remove owning content in professional detailed plain language; never append refresh logs.",
    "Validate content contracts, build, public-content boundaries and a local owner preview.",
    "Report changed and unchanged projects separately; after all gates pass, automatically commit, normal-push the existing PUBLIC main, wait for Pages and read back the deployed commit unless the owner explicitly holds publication or a new public/secret/paid/force-push boundary appears."
  ],
  expected_result: {
    changed_projects: "only materially stale projects",
    unchanged_projects: "explicit no-op with unchanged content SHA-256",
    auto_repairs: "named fixes with Owner evidence",
    blockers: "named evidence gaps without invented completion"
  }
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
